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
    public class UserArticleController : ControllerBase
    {
        private ElearningContext _context;

        public UserArticleController(ElearningContext context)
        {
            _context = context;
        }
        #region HttpDelete
        [HttpDelete("{articleID}/{userID}")]
        public void Delete(int articleID, int userID)
        {
            UserArticle userArticles = GetUserArticles(articleID, userID);

            _context.UserArticle.RemoveRange(userArticles);

            _context.SaveChanges();
        }
        #endregion
        #region HttpPut

        [HttpPut("{articleID}/{userID}")]
        public void Update(IFormCollection name, int articleID, int userID)
        {
            UpdateArticleObject(userID, articleID);
            _context.SaveChanges();
        }
        #endregion

        [HttpGet("{userID}")]
        public IEnumerable<Tuple<Article, bool, DateTime>> Get(int userID)
        {
            return GetArticleForUser(userID);
        }

        [HttpGet("dept/{userID}")]
        public IEnumerable<Article> GetArticlesForDept(int userID)
        {
            int deptID = GetDept(userID);
            return GetArticleForDeptFromDB(deptID);
        }

        [HttpGet]
        public IEnumerable<Article> Get()
        {
            return _context.Article.AsEnumerable();
        }
        [HttpGet("{userID}/{articleID}")]
        public bool Get(int userID, int articleID)
        {
            return CheckIfArticleISAssinged(userID, articleID);
        }
        #region HttpPost
        [HttpPost("{articleID}/{userID}")]
        public string Post(IFormCollection name, int articleID, int userID)
        { 
            UserArticle userArticle = CreateNewArticleUserObject(articleID, userID);

            AddDataToDataBase(userArticle);

            return "Ok";
        }
        #endregion
        #region Add
        private void AddDataToDataBase(UserArticle userArticle)
        {
            _context.UserArticle.Add(userArticle);
            _context.SaveChanges();
        }
        #endregion

        #region Create
        private UserArticle CreateNewArticleUserObject(int articleID, int userID)
        {
            UserArticle userArticle = new UserArticle();
            userArticle.ArtID = articleID;
            userArticle.UserID = userID;
            userArticle.isRead = false;
            userArticle.DeadLineForArticle = GetDeadLineForArticle(articleID);

            return userArticle;
        }

        #endregion
        private DateTime GetDeadLineForArticle(int articleID)
        {
            var data = _context.Article
                .Where(w => w.IdArticle == articleID)
                .Select(s => new 
                { 
                    s.NumberOfWeeks, 
                    s.WeekMonth
                })
                .FirstOrDefault();
            DateTime returnDateTime = DateTime.Now;
            if (data.WeekMonth == "weeks")
            {
                var days = data.NumberOfWeeks * 7;
                returnDateTime = DateTime.Now.AddDays(days);
            }
            else
            {
                returnDateTime = DateTime.Now.AddMonths(data.NumberOfWeeks);
            }
            return returnDateTime;

        }
        #region Update

        private void UpdateArticleObject(int userID, int articleID)
        {
            UserArticle oldArticle = GetOneUserArticleByID(articleID, userID);
            oldArticle.isRead = true;
 
        }
        #endregion
        #region Get Item

        private bool CheckIfArticleISAssinged(int userID, int articleID)
        {
            return _context
                .UserArticle
                    .Where(w => w.ArtID == articleID && w.UserID == userID)
                    .Count() > 0 
                    ? true 
                    : false;
        }
        private UserArticle GetOneUserArticleByID(int articleID, int userID)
        {
            return _context.UserArticle.Where(w => w.ArtID == articleID && w.UserID == userID).FirstOrDefault();
        }
        private UserArticle GetUserArticles(int articleID, int userID)
        {
            return _context.UserArticle.Where(w => w.ArtID == articleID && w.UserID == userID).FirstOrDefault();
        }
        private IEnumerable<Tuple<Article, bool, DateTime>> GetArticleForUser(int userID)
        {
            var articleDB = _context.Article;
            var userArticleDB = _context.UserArticle;
            var res = articleDB.Join(userArticleDB,
                          e1 => e1.IdArticle,
                          e2 => e2.ArtID,
                          (e1, e2) => new
                          {
                              e1,
                              e2
                          })
                .Where(w => w.e2.UserID == userID)
                .Select(s => new Tuple<Article, bool, DateTime>(s.e1, s.e2.isRead, s.e2.DeadLineForArticle)).AsEnumerable();
            return res;
        }

        private int GetDept(int userID)
        {
            return _context.User.Where(w => w.UserID == userID).Select(s => s.DepartamentID).FirstOrDefault(); 

        }
        private IEnumerable<Article> GetArticleForDeptFromDB(int deptID)
        {
            var articleDB = _context.Article;
            var deptArticleDB = _context.ArticleDept;
            var res = articleDB.Join(deptArticleDB,
                          e1 => e1.IdArticle,
                          e2 => e2.ArtID,
                          (e1, e2) => new
                          {
                              e1,
                              e2
                          })
                .Where(w => w.e2.DeptID == deptID)
                .Select(s => 
                new Article
                {  
                    IdArticle = s.e1.IdArticle,
                    Title = s.e1.Title
                } ).AsEnumerable();
            return res;
        }
        #endregion


    }
}
