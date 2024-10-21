// See https://aka.ms/new-console-template for more information
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text;
using ZahystOfInformation2.BLL.Lab2;
using ZahystOfInformation2.BLL.Lab3;

Console.WriteLine("Hello, World!");
string password = "i love you";
string hashedPassword = new Md5().getStringHash(password);
Console.WriteLine(hashedPassword);

byte[] key = new byte[16];
for (int i = 0; i < 16; i++)
{
    key[i] = (byte)Convert.ToByte(hashedPassword.Substring(2*i, 2), 16);
}


//byte[] key = new byte[16] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F };
//byte[] plaintext = new byte[] { 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF };

string message = "a lot of work, and some more";
byte[] text = Encoding.UTF8.GetBytes(message);
ulong[] iv = new ulong[2] { 0, 0 };
//// Example IV (Initialization Vector)
//ulong[] iv = new ulong[2] { 0x1234567890ABCDEF, 0xFEDCBA0987654321 };

var rc5 = new RC5(key);

var encryptedByteArray = rc5.EncryptCBC(text);
var encryptedMessage = Convert.ToBase64String(encryptedByteArray);
Console.WriteLine(encryptedMessage);
iv = new ulong[2] { 0, 0 };
var decryptedMessage = Encoding.UTF8.GetString(rc5.DecryptCBC(Convert.FromBase64String(encryptedMessage)));
Console.WriteLine(decryptedMessage);