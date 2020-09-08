using System;
using System.Collections.Generic;
using System.Linq;
using elearning.Models;
using Microsoft.AspNetCore.Mvc;

namespace elearning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartamentController : ControllerBase
    {
        private ElearningContext _context;

        public DepartamentController(ElearningContext context)
        {
            _context = context;
        }

        #region HttpGet
        [HttpGet]
        public IEnumerable<Departament> Get()
        {
            return _context.Departament.ToArray();
        }
        [HttpGet("{articleID}")]
        public IEnumerable<int> GetSelectedDept(int articleID)
        {
            var articleDeptDB = _context.ArticleDept;
            var deptDB = _context.Departament;
            var res = (articleDeptDB.Join(deptDB,
                          e1 => e1.DeptID,
                          e2 => e2.DeptID,
                          (e1, e2) => new
                          {
                              e1,
                              e2
                          })
                .Where(w => w.e1.ArtID == articleID)
                .Select(s =>s.e2.DeptID))
                .AsEnumerable();
            return res;
        }
        #endregion


    }
}
