using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Linq;
using System.Security.Cryptography;
using ZahystOfInformation2.BLL.Lab1;
using ZahystOfInformation2.BLL.Lab2;

namespace ZahystOfInformation2.BLL.Lab3
{
    public class RC5
    {
        private const int WORD_SIZE = 64;   // bits
        private const int ROUNDS = 16;      // Number of rounds
        private const int KEY_SIZE = 16;    // 128-bit key (16 bytes)
        private const int BLOCK_SIZE = WORD_SIZE * 2 / 8; // 128-bit block size (16 bytes, 2 x 64-bit)

        private readonly ulong[] S;         // Expanded key schedule

        // Magic constants for key expansion (specific to 64-bit words)
        private const ulong P64 = 0xB7E151628AED2A6B;
        private const ulong Q64 = 0x9E3779B97F4A7C15;

        private PseudoRandomSequenceGenerator _prsg;

        public RC5(byte[] key)
        {
            if (key.Length != KEY_SIZE)
                throw new ArgumentException($"Key must be {KEY_SIZE} bytes long.");

            _prsg = new(new Models.Lab1.GenerateLehmerSequenceRequest { m = int.MaxValue, a = 11*11*11, c = 1488 });
            // Initialize key schedule array
            S = new ulong[2 * (ROUNDS + 1)];

            KeyExpansion(key);
        }

        private void KeyExpansion(byte[] key)
        {
            int c = key.Length / (WORD_SIZE / 8); // Number of words in the key (64-bit words)
            ulong[] L = new ulong[c];

            // Convert key bytes into 64-bit words L[0], L[1], ..., L[c-1]
            for (int i = 0; i < key.Length; i++)
            {
                L[i / 8] |= (ulong)key[i] << (8 * (i % 8));
            }

            // Initialize the array S
            S[0] = P64;
            for (int i = 1; i < S.Length; i++)
            {
                S[i] = S[i - 1] + Q64;
            }

            // Mix in the key schedule
            ulong A = 0, B = 0;
            int iA = 0, j = 0;
            int n = Math.Max(S.Length, L.Length) * 3;
            for (int i = 0; i < n; i++)
            {
                A = S[iA] = RotateLeft((S[iA] + A + B), 3);
                B = L[j] = RotateLeft((L[j] + A + B), (int)(A + B) % WORD_SIZE);
                iA = (iA + 1) % S.Length;
                j = (j + 1) % L.Length;
            }
        }

        public byte[] EncryptCBC(byte[] plaintext)
        {
            ulong[] iv = new ulong[2];

            // Apply PKCS#7 padding
            byte[] paddedPlaintext = ApplyPadding(plaintext);

            // +1 because first block is IV
            int blockCount = paddedPlaintext.Length / BLOCK_SIZE;
            byte[] ciphertext = new byte[paddedPlaintext.Length];
            foreach (var (v,i) in _prsg.Generate(2).Select((v, i) => (v, i)))
            {
                iv[i] = Convert.ToUInt64(v);   
            }
            byte[] ivBlock = new byte[BLOCK_SIZE];
            Array.Copy(BitConverter.GetBytes(iv[0]), 0, ivBlock, 0, 8);
            Array.Copy(BitConverter.GetBytes(iv[1]), 0, ivBlock, 8, 8);

            for (int i = 0; i < blockCount; i++)
            {
                ulong[] block = new ulong[2];
                block[0] = BitConverter.ToUInt64(paddedPlaintext, i * BLOCK_SIZE);
                block[1] = BitConverter.ToUInt64(paddedPlaintext, i * BLOCK_SIZE + 8);

                ulong[] encryptedBlock = EncryptBlockCBC(block, ref iv);

                Array.Copy(BitConverter.GetBytes(encryptedBlock[0]), 0, ciphertext, i * BLOCK_SIZE, 8);
                Array.Copy(BitConverter.GetBytes(encryptedBlock[1]), 0, ciphertext, i * BLOCK_SIZE + 8, 8);
            }

            return ivBlock.Concat(ciphertext).ToArray();
        }

        public byte[] DecryptCBC(byte[] ciphertext)
        {
            var iv = new ulong[2] { BitConverter.ToUInt64(ciphertext, 0), BitConverter.ToUInt64(ciphertext, 8) };
            ciphertext = ciphertext.Skip(BLOCK_SIZE).ToArray();

            int blockCount = ciphertext.Length / BLOCK_SIZE;
            byte[] plaintext = new byte[ciphertext.Length];

            for (int i = 0; i < blockCount; i++)
            {
                ulong[] block = new ulong[2];
                block[0] = BitConverter.ToUInt64(ciphertext, i * BLOCK_SIZE);
                block[1] = BitConverter.ToUInt64(ciphertext, i * BLOCK_SIZE + 8);

                ulong[] decryptedBlock = DecryptBlockCBC(block, ref iv);

                Array.Copy(BitConverter.GetBytes(decryptedBlock[0]), 0, plaintext, i * BLOCK_SIZE, 8);
                Array.Copy(BitConverter.GetBytes(decryptedBlock[1]), 0, plaintext, i * BLOCK_SIZE + 8, 8);
            }

            // Remove padding after decryption
            return RemovePadding(plaintext);
        }

        private ulong[] EncryptBlockCBC(ulong[] block, ref ulong[] iv)
        {
            block[0] ^= iv[0];
            block[1] ^= iv[1];

            ulong[] ciphertext = EncryptBlock(block);

            iv[0] = ciphertext[0];
            iv[1] = ciphertext[1];

            return ciphertext;
        }

        private ulong[] DecryptBlockCBC(ulong[] block, ref ulong[] iv)
        {
            ulong[] decrypted = DecryptBlock(block);

            decrypted[0] ^= iv[0];
            decrypted[1] ^= iv[1];

            iv[0] = block[0];
            iv[1] = block[1];

            return decrypted;
        }

        private ulong[] EncryptBlock(ulong[] block)
        {
            ulong A = block[0] + S[0];
            ulong B = block[1] + S[1];

            for (int i = 1; i <= ROUNDS; i++)
            {
                A = RotateLeft((A ^ B), (int)B) + S[2 * i];
                B = RotateLeft((B ^ A), (int)A) + S[2 * i + 1];
            }

            return new ulong[] { A, B };
        }

        private ulong[] DecryptBlock(ulong[] block)
        {
            ulong A = block[0];
            ulong B = block[1];

            for (int i = ROUNDS; i > 0; i--)
            {
                B = RotateRight((B - S[2 * i + 1]), (int)A) ^ A;
                A = RotateRight((A - S[2 * i]), (int)B) ^ B;
            }

            A -= S[0];
            B -= S[1];

            return new ulong[] { A, B };
        }

        private static ulong RotateLeft(ulong x, int y)
        {
            return (x << y) | (x >> (WORD_SIZE - y));
        }

        private static ulong RotateRight(ulong x, int y)
        {
            return (x >> y) | (x << (WORD_SIZE - y));
        }

        private byte[] ApplyPadding(byte[] plaintext)
        {
            int paddingLength = BLOCK_SIZE - (plaintext.Length % BLOCK_SIZE);
            byte[] paddedPlaintext = new byte[plaintext.Length + paddingLength];

            Array.Copy(plaintext, paddedPlaintext, plaintext.Length);

            // Add padding (each byte set to paddingLength)
            for (int i = plaintext.Length; i < paddedPlaintext.Length; i++)
            {
                paddedPlaintext[i] = (byte)paddingLength;
            }

            return paddedPlaintext;
        }

        private byte[] RemovePadding(byte[] paddedPlaintext)
        {
            int paddingLength = paddedPlaintext.Last();
            if (paddingLength < 1 || paddingLength > BLOCK_SIZE)
            {
                throw new ArgumentException("Invalid padding.");
            }

            byte[] plaintext = new byte[paddedPlaintext.Length - paddingLength];
            Array.Copy(paddedPlaintext, plaintext, plaintext.Length);

            return plaintext;
        }


        public static byte[] GenerateKeyFromPasswordMd5(string password)
        {
            string hashedPassword = new Md5().getStringHash(password ?? "");
            byte[] key = new byte[16];
            for (int i = 0; i < 16; i++)
            {
                key[i] = (byte)Convert.ToByte(hashedPassword.Substring(2 * i, 2), 16);
            }
            return key;
        }
    }

}