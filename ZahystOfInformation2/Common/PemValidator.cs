namespace ZahystOfInformation2.Common
{
    using System;
    using System.Diagnostics.Eventing.Reader;
    using System.Text.RegularExpressions;

    public class PemValidator
    {
        private const string PublicKeyPattern = @"-----BEGIN RSA PUBLIC KEY-----[\s\S]+?-----END RSA PUBLIC KEY-----";
        private const string PrivateKeyPattern = @"-----BEGIN RSA PRIVATE KEY-----[\s\S]+?-----END RSA PRIVATE KEY-----";

        public static bool ValidatePublicKey(string publicKey)
        {
            return IsValidPublicKey(publicKey) && IsValidBase64Content(publicKey);
        }

        public static bool ValidatePrivateKey(string privateKey)
        {
            return IsValidPrivateKey(privateKey) && IsValidBase64Content(privateKey);
        }

        private static bool IsValidPublicKey(string pemString)
        {
            return Regex.IsMatch(pemString, PublicKeyPattern);
        }

        private static bool IsValidPrivateKey(string pemString)
        {
            return Regex.IsMatch(pemString, PrivateKeyPattern);
        }

        public static bool IsValidBase64Content(string pemString)
        {
            try
            {
                // Extract Base64 content between PEM headers
                string base64Content = Regex.Replace(pemString, @"-----BEGIN [\w\s]+-----|-----END [\w\s]+-----|\s", "");

                // Check if the extracted content is valid Base64
                Convert.FromBase64String(base64Content);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }

}
