namespace ZahystOfInformation2.Models.Lab1
{
    public class GenerateLehmerSequenceRequest
    {
        public int a { get; set; }
        public int m { get; set; }
        public int c { get; set; }
        public int x0 { get; set; }
        public int n { get; set; }

        public bool addNoise { get; set; }

        public GenerateLehmerSequenceRequest() { }
        public GenerateLehmerSequenceRequest(int a, int m, int c, int x0, int n)
        {
            a = a;
            m = m;
            c = c;
            x0 = x0;
            n = n;
        }
    }
}
