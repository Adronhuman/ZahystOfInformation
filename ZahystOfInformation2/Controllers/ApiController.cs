using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using ZahystOfInformation2.BLL.Lab2;
using ZahystOfInformation2.Models.Lab1;
using ZahystOfInformation2.Models.Lab2;
using ZahystOfInformation2.Tests;

namespace ZahystOfInformation2.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {

        [HttpPost("lehmer")]
        public IActionResult Generate([FromBody] GenerateLehmerSequenceRequest request)
        {
            var result = Enumerable.Repeat(0, request.n).ToList();
            BigInteger tempX = request.x0;
            BigInteger m = request.m;

            for (int i=0; i < request.n; i++)
            {
                tempX = (request.a * tempX + request.c) % m;
                if (request.addNoise) tempX += DateTime.Now.Ticks % 16;
                result[i] = (int) tempX;
            }

            return Ok( new { sequence = result });
        }

        [HttpPost("cesaro")]
        public IActionResult PerformCesaroTest([FromBody] CesaroTestRequest request, int vasya)
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
    }
}
