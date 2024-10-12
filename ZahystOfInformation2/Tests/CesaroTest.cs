using System.Numerics;

namespace ZahystOfInformation2.Tests
{
    public class CesaroTest
    {
        private List<int> sequence; // Assuming series is a List<int>

        public CesaroTest(List<int> series)
        {
            this.sequence = series;
        }

        public double CesaroTestMethod()
        {
            int n = sequence.Count;
            HashSet<(int, int)> pairs = new HashSet<(int, int)>();
            Random random = new Random();

            int pairsCount = Math.Min(1000, n*(n-1)/2);

            while (pairs.Count < pairsCount)
            {
                int i = random.Next(0, n);
                int j = random.Next(0, n);
                if (i < j)
                {
                    pairs.Add((i, j));
                }
            }

            int sum = 0;

            foreach (var (i, j) in pairs)
            {
                if (GCD(sequence[i], sequence[j]) == 1)
                {
                    sum++;
                }
            }
            // pairsCount * (6/pi**2) = sum
            // 6/pi**2 = sum / pairsCount
            // pi**2/6 = pairsCount/sum
            // pi**2 = 6*pairsCount/sum
            double estimatedPi = Math.Sqrt(6.0 * pairsCount / sum);
            //Console.WriteLine($"Estimated Pi: {estimatedPi}, Actual Pi: {Math.PI}");
            return estimatedPi;
        }

        private static int GCD(int a, int b)
        {
            return (int) BigInteger.GreatestCommonDivisor(a, b);
        }
    }
}
