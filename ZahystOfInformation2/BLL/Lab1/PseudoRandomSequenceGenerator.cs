using System.Numerics;
using ZahystOfInformation2.Models.Lab1;

namespace ZahystOfInformation2.BLL.Lab1
{
    public class PseudoRandomSequenceGenerator
    {
        private int x0, m, a, c;
        private bool addNoise;

        public PseudoRandomSequenceGenerator(GenerateLehmerSequenceRequest parameters)
        {
            x0 = parameters.x0;
            m = parameters.m;
            a = parameters.a;
            c = parameters.c;
            addNoise = parameters.addNoise;
        }

        public IEnumerable<int> Generate(int n)
        {
            var result = Enumerable.Repeat(0, n).ToList();

            for (int i = 0; i < n; i++)
            {
                BigInteger tempX = (a * x0 + c) % m;
                x0 = (int)(tempX % int.MaxValue);
                if (addNoise) tempX += DateTime.Now.Ticks % 16;
                result[i] = (int)tempX;
            }

            return result;
        }
    }
}
