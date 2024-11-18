using System.Security.Authentication;
using System.Security.Cryptography;

namespace ZahystOfInformation2.BLL.Lab4
{

    public class RSAFacade
    {
        public static RsaKeyPair GenerateKeys()
        {
            return RSAHelper.GenerateKeys();    
        }

        public static byte[] Cipher(string publicKey, byte[] message)
        {
            var rsa = RSA.Create();
            rsa.ImportFromPem(publicKey);
            return rsa.Encrypt(message, RSAEncryptionPadding.Pkcs1);
        }

        public static byte[] Decipher(string privateKey, byte[] message)
        {
            var rsa = RSA.Create();
            rsa.ImportFromPem(privateKey);
            return rsa.Decrypt(message, RSAEncryptionPadding.Pkcs1);
        }
    }
}
