using System.Text;

namespace ZahystOfInformation2.Common
{
    public static class GeneralExtensions
    {
        public static byte[] ReadBytesFromString(this string message)
        {
            return Encoding.ASCII.GetBytes(message);
        }

        public static string ConvertToUTF8str(this byte[] bytes)
        {
            return System.Text.Encoding.UTF8.GetString(bytes);
        }

        public static byte[] ReadBytesFromFile(this IFormFile file)
        {
            using var ms = new MemoryStream();
            file.CopyTo(ms);
            var byteArray = ms.ToArray();
            return byteArray;
        }

        public static string ReadAllText(this IFormFile file)
        {
            string fileContent;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                fileContent = reader.ReadToEnd();
            }

            return fileContent;
        }
    }
}
