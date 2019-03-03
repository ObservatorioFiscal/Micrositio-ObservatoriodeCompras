using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Compras.Models;
using BLL;
using System.IO;

namespace Compras.Controllers
{
    public class GobiernoCentralController : Controller
    {
        PostsLicitaciones _context1 = new PostsLicitaciones();
        PostsTrato _context2 = new PostsTrato();
        PostsConvenio _context3 = new PostsConvenio();
        PostsEmpresas _context4 = new PostsEmpresas();
        
        public ActionResult Index()
        {
            ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral";
            ViewData["Titulo"] = "Compras Gobierno Central - Observatorio de Compras";
            ViewData["Descripcion"] = "Conoce cuáles son las empresas que más venden al Estado y cuánta competencia existe en el Mercado Público";
            ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/Timg.png";
            return View();
        }
        
        public ActionResult LicitacionesPublicas(string id)
        {
            ViewBag.contiene = true;
            DLL.Post unico = _context1.ListPostsLicitaciones.SingleOrDefault(r => r.IdUrl == id);
            if(unico != null)
            {
                Dictionary<string, string> listaA = new Dictionary<string, string>();
                Dictionary<string, string> listaB = new Dictionary<string, string>();
                var listax = _context1.ListPostsLicitaciones.Where(r => r.IdUrl != id).Select(r => new { r.Id, r.IdUrl, r.Pregunta }).ToList();
                foreach (var item in listax.Where(r=>r.Id<unico.Id))
                {
                    listaA.Add(item.IdUrl, item.Pregunta);
                }
                foreach (var item in listax.Where(r => r.Id > unico.Id))
                {
                    listaB.Add(item.IdUrl, item.Pregunta);
                }
                ViewData["unico"] = unico;
                ViewData["listaA"] = listaA;
                ViewData["listaB"] = listaB;
                ViewBag.fondo = "blanco";

                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/LicitacionesPublicas/" + unico.RedUrl;
                ViewData["Titulo"] = unico.RedTitulo;
                ViewData["Descripcion"] = unico.RedDescripcion;
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/" + unico.RedImagen;
            }
            else
            {
                ViewBag.contiene = false;
                //unico = null;
                ViewData["Listado"] = _context1.ListPostsLicitaciones.ToList();
                ViewBag.fondo = "foto-carretera";
                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/LicitacionesPublicas/";
                ViewData["Titulo"] = "Ver datos sobre Licitaciones Publicas - Observatorio de Compras";
                ViewData["Descripcion"] = "Este mecanismo de compra es uno de los más utilizados, y a través de él, se transan los montos más significativos del Mercado Público. Revisa como se comporta";
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/Timg1.png";
            }
            
            return View();

        }
        
        public ActionResult TratosDirectos(string id)
        {
            ViewBag.contiene = true;
            DLL.Post unico = _context2.ListPostsTrato.SingleOrDefault(r => r.IdUrl == id);
            if (unico != null)
            {
                Dictionary<string, string> listaA = new Dictionary<string, string>();
                Dictionary<string, string> listaB = new Dictionary<string, string>();
                var listax = _context2.ListPostsTrato.Where(r => r.IdUrl != id).Select(r => new { r.Id, r.IdUrl, r.Pregunta }).ToList();
                foreach (var item in listax.Where(r => r.Id < unico.Id))
                {
                    listaA.Add(item.IdUrl, item.Pregunta);
                }
                foreach (var item in listax.Where(r => r.Id > unico.Id))
                {
                    listaB.Add(item.IdUrl, item.Pregunta);
                }
                ViewData["unico"] = unico;
                ViewData["listaA"] = listaA;
                ViewData["listaB"] = listaB;
                ViewBag.fondo = "blanco";

                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/TratosDirectos/" + unico.RedUrl;
                ViewData["Titulo"] = unico.RedTitulo;
                ViewData["Descripcion"] = unico.RedDescripcion;
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/" + unico.RedImagen;
            }
            else
            {
                ViewBag.contiene = false;
                ViewData["Listado"] = _context2.ListPostsTrato.ToList();
                ViewBag.fondo = "foto-hospital";
                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/TratosDirectos";
                ViewData["Titulo"] = "Ver datos sobre Tratos Directos - Observatorio de Compras";
                ViewData["Descripcion"] = "Esta modalidad de compra de carácter excepcional, que debe ser utilizado cuando los Servicios Públicos requieren realizar compras de manera rápida. Revisa como se comporta";
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/Timg2.png";
            }
            return View();
        }
        
        public ActionResult ConveniosMarco(string id)
        {
            ViewBag.contiene = true;
            DLL.Post unico = _context3.ListPostsConvenio.SingleOrDefault(r => r.IdUrl == id);
            if (unico != null)
            {
                Dictionary<string, string> listaA = new Dictionary<string, string>();
                Dictionary<string, string> listaB = new Dictionary<string, string>();
                var listax = _context3.ListPostsConvenio.Where(r => r.IdUrl != id).Select(r => new { r.Id, r.IdUrl, r.Pregunta }).ToList();
                foreach (var item in listax.Where(r => r.Id < unico.Id))
                {
                    listaA.Add(item.IdUrl, item.Pregunta);
                }
                foreach (var item in listax.Where(r => r.Id > unico.Id))
                {
                    listaB.Add(item.IdUrl, item.Pregunta);
                }
                ViewData["unico"] = unico;
                ViewData["listaA"] = listaA;
                ViewData["listaB"] = listaB;
                ViewBag.fondo = "blanco";

                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/ConveniosMarco/" + unico.RedUrl;
                ViewData["Titulo"] = unico.RedTitulo;
                ViewData["Descripcion"] = unico.RedDescripcion;
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/" + unico.RedImagen;
            }
            else
            {
                ViewBag.contiene = false;
                //unico = null;
                ViewData["Listado"] = _context3.ListPostsConvenio.ToList();
                ViewBag.fondo = "foto-imprenta";
                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/ConveniosMarco";
                ViewData["Titulo"] = "Ver datos sobre Convenios Marco - Observatorio de Compras";
                ViewData["Descripcion"] = "Un catálogo de productos y servicios completo para el Estado. Revisa como se comporta";
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/Timg3.png";
            }
            return View();
        }
        
        public ActionResult EmpresasoSocios(string id)
        {
            ViewBag.contiene = true;
            DLL.Post unico = _context4.ListPostsEmpresas.SingleOrDefault(r => r.IdUrl == id);
            if (unico != null)
            {
                Dictionary<string, string> listaA = new Dictionary<string, string>();
                Dictionary<string, string> listaB = new Dictionary<string, string>();
                var listax = _context4.ListPostsEmpresas.Where(r => r.IdUrl != id).Select(r => new { r.Id, r.IdUrl, r.Pregunta }).ToList();
                foreach (var item in listax.Where(r => r.Id < unico.Id))
                {
                    listaA.Add(item.IdUrl, item.Pregunta);
                }
                foreach (var item in listax.Where(r => r.Id > unico.Id))
                {
                    listaB.Add(item.IdUrl, item.Pregunta);
                }
                ViewData["unico"] = unico;
                ViewData["listaA"] = listaA;
                ViewData["listaB"] = listaB;
                ViewBag.fondo = "blanco";

                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/EmpresasoSocios/" + unico.RedUrl;
                ViewData["Titulo"] = unico.RedTitulo;
                ViewData["Descripcion"] = unico.RedDescripcion;
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/" + unico.RedImagen;

            }
            else
            {
                ViewBag.contiene = false;
                //unico = null;
                ViewData["Listado"] = _context4.ListPostsEmpresas.ToList();
                ViewBag.fondo = "foto-cocina";
                ViewData["Url"] = "https://compras.observatoriofiscal.cl/GobiernoCentral/EmpresasoSocios";
                ViewData["Titulo"] = "Ver el comportamientos de Empresas y/o Socios - Observatorio de Compras";
                ViewData["Descripcion"] = "Toda persona natural o jurídica que entrega algún servicio o bien al Estado, a cambio de un monto específico. Revisa como se comporta";
                ViewData["Imagen"] = "https://compras.observatoriofiscal.cl/images/redes/Timg4.png";
            }
            return View();
        }


        
        public ActionResult Inscribir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Inscribir( string email, string whatsapp)
        {
                //Pass the filepath and filename to the StreamWriter Constructor
                StreamWriter sw = new StreamWriter(@"wwwroot\data\Owners.txt", true);

                //Write a line of text
                sw.WriteLine(email +" ; "+ whatsapp);

                //Write a second line of text
                //sw.WriteLine("From the StreamWriter class");

                //Close the file
                sw.Close();
           
            return Json(true);
        }


    }
}