using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests
{
    public static class Extensions
    {
        public static void NotNullOrEmpty(string value)
        {
            Assert.False(string.IsNullOrEmpty(value), "The string is empty.");
        }
    }
}
