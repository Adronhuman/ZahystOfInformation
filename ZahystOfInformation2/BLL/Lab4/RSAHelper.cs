using System.Security.Cryptography;
using System.Windows.Markup;

namespace ZahystOfInformation2.BLL.Lab4
{
    public class RsaKeyPair
    {
        public string Private { get; set; }
        public string Public { get; set; }
    }

    public class RSAHelper
    {
        public static RsaKeyPair GenerateKeys()
        {
            RSA rsa = RSA.Create();
            var parameters = rsa.ExportParameters(false);
            string privateKey = rsa.ExportRSAPrivateKeyPem();
            string publicKey = rsa.ExportRSAPublicKeyPem();
            return new RsaKeyPair { Private = privateKey, Public = publicKey }; 
        }

        public static void SomeShit()
        {
            var keyPair = GenerateKeys();

            var rsa = RSA.Create();
            //var parameters = new RSAParameters();
            rsa.ImportFromPem(keyPair.Public);
            rsa.ImportFromPem(keyPair.Private);


            var sex = RSA.Create();
            

            var keyPair2 = rsa.ExportRSAPrivateKeyPem();
            //rsa.ImportParameters(RSAParameters)
        }
    }
}
