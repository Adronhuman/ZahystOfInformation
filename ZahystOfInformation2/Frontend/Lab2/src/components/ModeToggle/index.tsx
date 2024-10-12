import React from 'react';
import { MD5Context } from '../../context';
import { Md5Mode, MD5State } from '../../context/types';

import "./ModeToggle.css";
import { When } from 'react-if';
import { toast } from 'react-toastify';

export interface ModeToggleProps {
    disabled?: boolean;
}

function isValidHash(str: string) {
    const hexPattern = /^[0-9a-fA-F]+$/; // regex to match hex characters
    const isHex = typeof str === 'string' && hexPattern.test(str);
    return isHex && str.length == 32;
}

const shitState = {
    skipValidation: false
}

const ModeToggle: React.FC<ModeToggleProps> = ({disabled}) => {
    const state = React.useContext(MD5Context);
    const { mode, changeState } = state;
    
    const setMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mode: Md5Mode) => {
        e.stopPropagation();
        e.preventDefault();
        
        let newState: MD5State = {...state, mode: mode};
        if (mode !== "verify"){
            newState = {...newState, isValid: true, expectedHash: undefined};
        }
        changeState(newState);
    };

    const setExpectedHash = (hash: string) => {
        console.log("setExpectedhash, OnBlur");
        const isValid = isValidHash(hash);
        if (isValid) {
            changeState({...state, expectedHash: hash, isValid: true});
        } else {
            toast.error("Not valid md5 hash!");
            changeState({...state, isValid: false});
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFocusIn = (e: any) => {
        if (e.target.id) {
            shitState.skipValidation = true;
        }
    }

    React.useEffect(() => {
        document.addEventListener('focusin', handleFocusIn)
        return () => {
          document.removeEventListener('focusin', handleFocusIn)
      };
    }, []);

    return <>
        <div className="mode-toggle">
            <button id="hash-mode"
                className={mode === 'hash' ? 'active' : ''}
                onClick={(e) => {
                    console.log("hash click");
                    setMode(e, 'hash')
                }}
                disabled={disabled}
                >
                HASH
            </button>
            <button
                className={mode === 'verify' ? 'active' : ''}
                onClick={(e) => setMode(e, 'verify')}
                disabled={disabled}
                >
                VERIFY
            </button>
        </div>
        <When condition={mode === "verify"}>
            <input disabled={disabled}
                style={{width:280}}
                type='text'
                placeholder='Enter expected hash here'
                onBlur={(e) => {
                    setTimeout(() => {
                        if (shitState.skipValidation) return;
                        setExpectedHash(e.target.value)
                    }, 50);
                }
                }
            />
        </When>
    </>
}

export default ModeToggle;
