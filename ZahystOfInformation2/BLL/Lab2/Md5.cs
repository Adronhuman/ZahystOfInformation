using System.Linq;
using System.Text;

namespace ZahystOfInformation2.BLL.Lab2
{
    public class Md5
    {
        static uint[] T = new uint[]
        {
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
            0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
            0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
            0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
            0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
            0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
            0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
        };

        Func<uint, uint, uint, uint> F = (b, c, d) => (b & c) | (~b & d);
        Func<uint, uint, uint, uint> G = (b, c, d) => (b & d) | (c & ~d);
        Func<uint, uint, uint, uint> H = (b, c, d) => b ^ c ^ d;
        Func<uint, uint, uint, uint> I = (b, c, d) => c ^ (b | ~d);
        //Func<int, int, int, int> F = (b, c, d) => (b & c) | (~b & d);
        //Func<int, int, int, int> G = (b, c, d) => (b & d) | (c & ~d);
        //Func<int, int, int, int> H = (b, c, d) => b ^ c ^ d;
        //Func<int, int, int, int> I = (b, c, d) => c ^ (b | ~d);

        private (IEnumerable<byte>, uint) step1(byte[] data)
        {
            IEnumerable<byte> extended;
            uint originalLength = (uint) data.Length * 8;
            extended = data.Append((byte)0x80);

            while (8*extended.Count() % 512 != 448)
                extended = extended.Append((byte)0);

            return (extended, originalLength);
        }

        private IEnumerable<byte> step2(IEnumerable<byte> data, uint originalLength)
        {
            // 4 bytes
            var length = BitConverter.GetBytes(originalLength);
            // another 4 bytes
            byte[] zeroBytes = [0,0,0,0];

            return data.Concat(length).Concat(zeroBytes);
        }

        private (uint, uint, uint, uint) step3(IEnumerable<byte> data)
        {
            (uint, uint, uint, uint) buffer = (0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);

            var leftRotate = (uint x, int amount) => (x << amount | x >> (32 - amount));

            // 512 bits == 64 bytes == 16 int32-ers
            foreach (var chunk in data.Chunk(64))
            {
                var x = new uint[16];
                var (A, B, C, D) = buffer;
                for (int i = 0; i < 16; i++)
                {
                    x[i] = BitConverter.ToUInt32(new ArraySegment<byte>(chunk, 4 * i, 4));
                }

                uint k = 0;
                var s = new int[4];
                uint temp = 0;
                for (uint i = 0; i < 64; i++)
                {
                    if (i <= 15)
                    {
                        k = i;
                        s = [7, 12, 17, 22];
                        temp = F(B, C, D);
                    }
                    else if (i <= 31)
                    {
                        k = ((5 * i) + 1) % 16;
                        s = [5, 9, 14, 20];
                        temp = G(B, C, D);
                    }
                    else if (i <= 47)
                    {
                        k = ((3 * i) + 5) % 16;
                        s = [4, 11, 16, 23];
                        temp = H(B, C, D);
                    }
                    else if (i <= 63)
                    {
                        k = (7 * i) % 16;
                        s = [6, 10, 15, 21];
                        temp = I(B, C, D);
                    }
                    var (a, b, c, d) = (D, B + leftRotate(A + T[i] + x[k] + temp, s[i % 4]), B, C);
                    (A, B, C, D) = (a, b, c, d);
                    //Console.WriteLine($"{A}, {B}, {C}, {D}");
                }
                var (A_old, B_old, C_old, D_old) = buffer;
                buffer = (A_old + A, B_old + B, C_old + C, D_old + D);
                //Console.WriteLine($"Buffer - {buffer.Item1}, {buffer.Item2}, {buffer.Item3}, {buffer.Item4}");
            }

            return buffer;
        }

        private string step4(uint A, uint B, uint C, uint D)
        {
            IEnumerable<byte> bytes = new List<byte>();
            bytes = bytes.Concat(BitConverter.GetBytes(A)).Concat(BitConverter.GetBytes(B)).Concat(BitConverter.GetBytes(C)).Concat(BitConverter.GetBytes(D));

            return Convert.ToHexString(bytes.ToArray());
        }

        public string hash(byte[] data)
        {
            var (padded, originalLength) = step1(data);
            IEnumerable<byte> extended = step2(padded, originalLength);
            var (A, B, C, D) = step3(extended);
            var result = step4(A, B, C, D);

            return result;
        }

        public string getStringHash(string str) {
            var byteArray = Encoding.UTF8.GetBytes(str);
            return hash(byteArray);
        }

        public string getStringHash(IFormFile file)
        {
            using var ms = new MemoryStream();
            file.CopyTo(ms);
            var byteArray = ms.ToArray();

            return hash(byteArray);
        }
    }
}
