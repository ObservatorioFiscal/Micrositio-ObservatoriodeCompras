using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DLL
{
    public class Post
    {
        public int Id { get; set; }
        public string IdUrl { get; set; }
        public string Pregunta { get; set; }
        public string GraficoWeb { get; set; }
        public string GraficoMobile { get; set; }
        public string Descripcion { get; set; }

        public string RedTitulo { get; set; }
        public string RedDescripcion { get; set; }
        public string RedUrl { get; set; }
        public string RedImagen { get; set; }
    }
}
