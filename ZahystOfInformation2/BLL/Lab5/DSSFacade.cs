using System.Security.Cryptography;
using ZahystOfInformation2.BLL.Lab4;

namespace ZahystOfInformation2.BLL.Lab5
{
    public class DSAKeyPair
    {
        public static DSAKeyPair GenerateKeys()
        {
            DSA dsa = DSA.Create();
            string privateKey = dsa.ExportPkcs8PrivateKeyPem();
            string publicKey = dsa.ExportSubjectPublicKeyInfoPem();
            return new DSAKeyPair { Private = privateKey, Public = publicKey };
        }

        public string Private { get; set; }
        public string Public { get; set; }
    }

    public class DSSFacade
    {
        public static byte[] SignData(byte[] data, string privateKey)
        {
            using (DSA dsa = DSA.Create())
            {
                dsa.ImportFromPem(privateKey);
                return dsa.SignData(data, HashAlgorithmName.SHA256);
            }
        }

        public static bool VerifySignature(byte[] data, byte[] signature, string publicKey)
        {
            using (DSA dsa = DSA.Create())
            {
                dsa.ImportFromPem(publicKey);
                return dsa.VerifyData(data, signature, HashAlgorithmName.SHA256);
            }
        }
    }
}
