using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Compras.Models
{
    public class Post
    {
        public string IdUrl { get; set; }
        public string Pregunta { get; set; }
        public string Titulo { get; set; }
        public string GraficoWeb { get; set; }
        public string GraficoMobile { get; set; }
        public string Descripcion { get; set; }
        public string Opcion1 { get; set; }
        public string Opcion2 { get; set; }
        public bool Activo { get; set; }
        public int Tipo { get; set; }
    }
    
    public class TipoPublicacion
    {
        public static int LicitacionesPublicas = 1;
        public static int TratosDirectos = 2;
        public static int ConveniosMarcos = 3;
        public static int EmpresasContratadas = 4;
    }
}
