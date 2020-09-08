using System;
using System.Collections.Generic;
using System.Linq;
using elearning.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace elearning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private ElearningContext _context;

        public UserController(ElearningContext context)
        {
            _context = context;
        }

        #region HttpGet
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _context.User.ToArray();
        }

        [HttpGet("{deptID}")]
        public IEnumerable<User> Get(int deptID)
        {
            return _context.User.Where(w => w.DepartamentID == deptID).ToArray();
        }
        [HttpGet("userID/{userID}")]
        public User GetItem(int userID)
        {
            return _context.User.Where(w => w.UserID == userID).FirstOrDefault();
        }

        [HttpGet("email/{userEmail}")]
        public bool CheckUser(string userEmail)
        {
            var user = _context.UserLogin.Where(w => w.Email== userEmail).FirstOrDefault();

            return user != null ? true : false;
        }
        [HttpGet("userLoginID/{userID}")]
        public bool GetUserLogin(int userID)
        {
            return _context.UserLogin.Where(w => w.UserID == userID).Select(s=>s.IsAdmin).FirstOrDefault();
        }

        #endregion

        #region HttpPost
        [HttpPost]
        public UserLogin Post([FromBody]List<string> name)
        {
            var user = _context.UserLogin.Where(w => w.Email == name[0] && w.Passward == name[1]).FirstOrDefault();

            return user;
        }
        #endregion


    }
}
