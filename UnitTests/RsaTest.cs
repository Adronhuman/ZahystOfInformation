using Microsoft.VisualStudio.TestPlatform.CommunicationUtilities;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using ZahystOfInformation2.BLL.Lab4;
using ZahystOfInformation2.Common;

namespace UnitTests
{
    public static class SupportedLabels
    {
        public const string PublicKey = "RSA PUBLIC KEY";
        public const string PrivateKey = "RSA PRIVATE KEY";
    }

    public class RsaTest
    {
        [Fact]
        public void GenerateKeys()
        {
            var keyPair = RSAFacade.GenerateKeys();
            Assert.NotNull(keyPair);
            Assert.False(string.IsNullOrEmpty(keyPair.Public), "The string is nullorempty.");
            Assert.False(string.IsNullOrEmpty(keyPair.Private), "The string is nullorempty.");

            Assert.Contains(SupportedLabels.PublicKey, keyPair.Public);
            Assert.Contains(SupportedLabels.PrivateKey, keyPair.Private);
        }

        [Theory]
        [InlineData("")]
        [InlineData("word")]
        [InlineData(@"
            some multiline text
        ")]
        public void EncryptionDecryption(string message)
        {
            var keyPair = RSAFacade.GenerateKeys();
            string publicKey = keyPair.Public;
            string privateKey = keyPair.Private;

            byte[] encryptedData = RSAFacade.Cipher(publicKey, message.ReadBytesFromString());

            byte[] decryptedData = RSAFacade.Decipher(privateKey, encryptedData);

            string encryptedDecrypted = decryptedData.ConvertToUTF8str();
            Assert.Equal(message, encryptedDecrypted);
        }

        [Fact]
        public void EncryptionDecryptionFile()
        {
            string tempFilePath = Path.GetTempFileName();

            string content = "Hello, from File!";
            File.WriteAllText(tempFilePath, content);

            var keyPair = RSAFacade.GenerateKeys();
            string publicKey = keyPair.Public;
            string privateKey = keyPair.Private;

            byte[] data = File.ReadAllBytes(tempFilePath);

            byte[] encryptedData = RSAFacade.Cipher(publicKey, data);
            byte[] decryptedData = RSAFacade.Decipher(privateKey, encryptedData);

            Assert.Equal(data, decryptedData);
        }

        
    }
}