export interface KeyPair {
    private: string;
    public: string;
}

export interface FileKeyPair {
    private?: File;
    public?: File;
}