using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZahystOfInformation2.BLL.Lab4;
using ZahystOfInformation2.BLL.Lab5;

namespace UnitTests
{
    public class DsaTest
    {

        [Fact]
        public void MainTest()
        {
            var keyPair = DSAKeyPair.GenerateKeys();

            var message = "Something for your mind";
            var data = Encoding.UTF8.GetBytes(message);
            
            var signature = DSSFacade.SignData(data, keyPair.Private);

            var verificationResult = DSSFacade.VerifySignature(data, signature, keyPair.Public);
            Assert.True(verificationResult);
        }
    }
}
