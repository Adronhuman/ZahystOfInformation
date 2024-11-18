using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography.Xml;
using System.Text;
using ZahystOfInformation2.BLL.Lab1;
using ZahystOfInformation2.BLL.Lab2;
using ZahystOfInformation2.BLL.Lab3;
using ZahystOfInformation2.BLL.Lab4;
using ZahystOfInformation2.Common;
using ZahystOfInformation2.Models.Lab1;
using ZahystOfInformation2.Models.Lab2;
using ZahystOfInformation2.Models.Lab3;
using ZahystOfInformation2.Tests;

namespace ZahystOfInformation2.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {

        [HttpPost("lehmer")]
        public IActionResult Generate([FromBody] GenerateLehmerSequenceRequest request)
        {
            var result = new PseudoRandomSequenceGenerator(request).Generate(request.n);

            return Ok( new { sequence = result });
        }

        [HttpPost("cesaro")]
        public IActionResult PerformCesaroTest([FromBody] CesaroTestRequest request)
        {
            var testModule = new CesaroTest(request.sequence.ToList());
            var estimatedPi = testModule.CesaroTestMethod();

            return Ok(new CesaroTestResponse { estimatedPi = estimatedPi });
        }

        [HttpPost("md5-string")]
        public IActionResult Md5Hash([FromBody] Md5Request request)
        {
            return Ok(new { hash = new Md5().getStringHash(request.str) });
        }

        [HttpPost("md5-file")]
        [DisableRequestSizeLimit]
        public IActionResult Md5Hash([FromForm] IFormFile file)
        {   
            return Ok(new { hash = new Md5().getStringHash(file) });
        }

        [HttpPost("rc5-string-encrypt")]
        [DisableRequestSizeLimit]
        public IActionResult Rc5([FromBody] Rc5Request request)
        {
            var key = RC5.GenerateKeyFromPasswordMd5(request.password);
            var rc5 = new RC5(key);
            var messageInBytes = Encoding.UTF8.GetBytes(request.message);
            var messageEncrypted = Convert.ToBase64String(rc5.EncryptCBC(messageInBytes));
            return Ok(new { message = messageEncrypted });
        }

        [HttpPost("rc5-string-decrypt")]
        [DisableRequestSizeLimit]
        public IActionResult Rc5Decrypt([FromBody] Rc5Request request)
        {
            var key = RC5.GenerateKeyFromPasswordMd5(request.password);
            var rc5 = new RC5(key);
            try
            {
                var messageInBytes = Convert.FromBase64String(request.message);
                var messageDecrypted = Encoding.UTF8.GetString(rc5.DecryptCBC(messageInBytes));
                return Ok(new { message = messageDecrypted });
            } catch
            {
                return BadRequest();
            }
        }

        [HttpPost("rc5-file-encrypt")]
        [DisableRequestSizeLimit]
        public IActionResult Rc5([FromForm] string password, [FromForm] IFormFile file)
        {
            //var key = RC5.GenerateKeyFromPasswordMd5(request.password);
            //var rc5 = new RC5(key);
            //var messageInBytes = Encoding.UTF8.GetBytes(request.message);
            //var messageEncrypted = Convert.ToBase64String(rc5.EncryptCBC(messageInBytes));
            //return Ok(new { message = messageEncrypted });
            var byteArray = file.ReadBytesFromFile();
            var key = RC5.GenerateKeyFromPasswordMd5(password);
            var rc5 = new RC5(key);
            var encryptedByteArray = rc5.EncryptCBC(byteArray);

            return File(encryptedByteArray, "application/octet-stream", "encryptedFile.bin");   
        }

        [HttpPost("rc5-file-decrypt")]
        [DisableRequestSizeLimit]
        public IActionResult Rc5Decrypt([FromForm] string password, [FromForm] IFormFile file)
        {
            var key = RC5.GenerateKeyFromPasswordMd5(password);
            var rc5 = new RC5(key);

            try
            {
                var byteArray = file.ReadBytesFromFile();
                var encryptedByteArray = rc5.DecryptCBC(byteArray);
                return File(encryptedByteArray, "application/octet-stream");
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("rsa-generate-key-pair")]
        public IActionResult GeneratePublicPrivate()
        {
            var keys = RSAHelper.GenerateKeys();
            return Ok(keys);
        }

        [HttpPost("rsa-encrypt")]
        public IActionResult EncryptRsa([FromForm] string message, [FromQuery] bool isFile, [FromForm] IFormFile publicPem, [FromForm] IFormFile file)
        {
            message ??= string.Empty;
            byte[] data = isFile ? file.ReadBytesFromFile() : Encoding.UTF8.GetBytes(message);

            if (data.Length > 245)
            {
                return MessageToLarge();
            }

            string pem = publicPem.ReadAllText();
            if (!PemValidator.ValidatePublicKey(pem))
            {
                return WrongKeyFormat();
            }

            byte[] dataEncrypted = RSAFacade.Cipher(pem, data);
            return isFile ? 
                File(dataEncrypted, "application/octet-stream", "encryptedFile.bin") : 
                Ok(new { result = Convert.ToBase64String(dataEncrypted)});
        }

        [HttpPost("rsa-decrypt")]
        public IActionResult DecryptRsa([FromForm] string message, [FromQuery] bool isFile, [FromForm] IFormFile privatePem, [FromForm] IFormFile file)
        {
            if (!PemValidator.IsValidBase64Content(message))
            {
                return CouldntDecrypt();
            }

            byte[] data = isFile ? file.ReadBytesFromFile() : Convert.FromBase64String(message);

            if (data.Length > 256)
            {
                return MessageToLarge();
            }

            string pem = privatePem.ReadAllText();
            if (!PemValidator.ValidatePrivateKey(pem))
            {
                return WrongKeyFormat();
            }

            try
            {
                byte[] dataDecrypted = RSAFacade.Decipher(pem, data);
                return Ok(new { result = Encoding.UTF8.GetString(dataDecrypted) });
            } catch (Exception ex)
            {
                return CouldntDecrypt();
            }
        }

        private IActionResult CouldntDecrypt()
        {
            return BadRequest(new { message = "Couldn't decrypt" });
        }

        private IActionResult WrongKeyFormat()
        {
            return BadRequest(new { message = "Provided key is in wrong format"});
        }

        private IActionResult MessageToLarge() 
        {
            return BadRequest(new { message = "What the f**k are you trying to encrypt?" });
        }
    }
}
