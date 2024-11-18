namespace ZahystOfInformation2.Common
{
    using System;
    using System.Diagnostics.Eventing.Reader;
    using System.Text.RegularExpressions;

    public class PemValidator
    {
        private const string RsaPublicKeyPattern = @"-----BEGIN RSA PUBLIC KEY-----[\s\S]+?-----END RSA PUBLIC KEY-----";
        private const string RsaPrivateKeyPattern = @"-----BEGIN RSA PRIVATE KEY-----[\s\S]+?-----END RSA PRIVATE KEY-----";
        
        private const string DsaPublicKeyPattern = @"-----BEGIN PUBLIC KEY-----[\s\S]+?-----END PUBLIC KEY-----";
        private const string DsaPrivateKeyPattern = @"-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----";

        public static bool ValidateDsaPublicKey(string publicKey)
        {
            return ValidatePublicKey(publicKey, DsaPublicKeyPattern);
        }

        public static bool ValidateDsaPrivateKey(string privateKey)
        {
            return ValidatePrivateKey(privateKey, DsaPrivateKeyPattern);
        }

        public static bool ValidateRsaPublicKey(string publicKey)
        {
            return ValidatePublicKey(publicKey, RsaPublicKeyPattern);
        }

        public static bool ValidateRsaPrivateKey(string privateKey)
        {
            return ValidatePrivateKey(privateKey, RsaPrivateKeyPattern);
        }

        private static bool ValidatePublicKey(string publicKey, string pattern)
        {
            return IsValidPublicKey(publicKey, pattern) && IsValidBase64Content(publicKey);
        }

        private static bool ValidatePrivateKey(string privateKey, string pattern)
        {
            return IsValidPrivateKey(privateKey, pattern) && IsValidBase64Content(privateKey);
        }

        private static bool IsValidPublicKey(string pemString, string pattern)
        {
            return Regex.IsMatch(pemString, pattern);
        }

        private static bool IsValidPrivateKey(string pemString, string pattern)
        {
            return Regex.IsMatch(pemString, pattern);
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
