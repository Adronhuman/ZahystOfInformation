using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Security.Cryptography.Xml;
using System.Text;
using ZahystOfInformation2.BLL.Lab1;
using ZahystOfInformation2.BLL.Lab2;
using ZahystOfInformation2.BLL.Lab3;
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
            var byteArray = readBytesFromFile(file);
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
                var byteArray = readBytesFromFile(file);
                var encryptedByteArray = rc5.DecryptCBC(byteArray);
                return File(encryptedByteArray, "application/octet-stream");
            }
            catch
            {
                return BadRequest();
            }
        }

        private static byte[] readBytesFromFile(IFormFile file)
        {
            using var ms = new MemoryStream();
            file.CopyTo(ms);
            var byteArray = ms.ToArray();
            return byteArray;
        }
    }
}
