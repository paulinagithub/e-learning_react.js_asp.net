using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using elearning.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace elearning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArticleController : ControllerBase
    {
        private ElearningContext _context;
        private readonly IHostingEnvironment _environment;

        public ArticleController(ElearningContext context, IHostingEnvironment IHostingEnvironment)
        {
            _context = context;
            _environment = IHostingEnvironment;

        }

        #region HttpGet
        [HttpGet("{articleID}")]
        public Article Get(int articleID)
        {
            return GetOneArticleByID(articleID);
        }
        [HttpGet("file/{articleID}")]
        public Task<IActionResult> GetFile(int articleID)
        {
            return DownloadFileFromFileSystem(articleID);
        }
        [HttpGet("{articleID}/{userID}")]
        public bool GetIfRead(int articleID, int userID)
        {
            return CheckIfArticleIsRead(articleID, userID);
        }
        [HttpGet("mineGet")]
        public IEnumerable<Article> Get()
        {
            return _context.Article.ToArray();
        }

        #endregion
        #region HttpDelete
        [HttpDelete("{articleID}")]
        public void Delete(int articleID)
        {
            RemoveItemFromArticleDept(articleID);
            Article article = GetOneArticleByID(articleID);
            List<UserArticle> userArticles = GetUserArticles(articleID);
            List<ArticleDept> articlesDept = GetArticlesDept(articleID);

            _context.Article.Remove(article);
            _context.UserArticle.RemoveRange(userArticles);
            _context.ArticleDept.RemoveRange(articlesDept);

            _context.SaveChanges();
        }
        #endregion
        #region HttpPut

        [HttpPut("{articleID}/{userEmail}")]
        public void Update(IFormCollection name, int articleID, string userEmail)
        {
            var inputValue = GetDataFromFormCollection(name);

            string filePath = "";
            if (name.Files.Any())
            {
                filePath = CreateFilePathToSave(name.Files[0]);
            }

            Article newArticle = CreateNewArticleObject(inputValue, filePath, userEmail);
            RemoveItemFromArticleDept(articleID);

            UpdateArticleObject(newArticle, articleID);
            InsertDataToArticleDeptTable(articleID, inputValue[1]);
            ChangeDeadLineForArticleToRead(articleID, inputValue[2],int.Parse(inputValue[3]));

            _context.SaveChanges();
        }
        #endregion
        #region HttpPost
        [HttpPost("{userEmail}")]
        public string Post(IFormCollection name, string userEmail)
        {
            var inputValue = GetDataFromFormCollection(name);
            string filePath = "";

            if (name.Files.Any())
            {
                filePath = CreateFilePathToSave(name.Files[0]);
            }
         
            Article article = CreateNewArticleObject(inputValue, filePath, userEmail);

            string deptID = inputValue[1];
            AddDataToDataBase(article, deptID);

            return "Ok";
        }
        #endregion

        private bool CheckIfArticleIsRead(int articleID, int userID)
        {
            return _context.UserArticle
                .Where(w => w.ArtID == articleID && w.UserID == userID)
                .Select(s => s.isRead)
                .FirstOrDefault();
        }
        private string CreateFilePathToSave(IFormFile file)
        {
            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var myUniqueFileName = Convert.ToString(Guid.NewGuid());
                var FileExtension = Path.GetExtension(fileName);

                var newFileName = myUniqueFileName + FileExtension;

                fileName = Path.Combine(_environment.ContentRootPath, "demoImages") + $@"\{newFileName}";

                CreateFile(fileName, file);

                return "demoImages/" + newFileName;
            }
            else
            {
                return null;
            }

        }
        private void CreateFile(string fileName, IFormFile file)
        {
            using (FileStream fs = System.IO.File.Create(fileName))
            {
                file.CopyTo(fs);
                fs.Flush();
            }

        }
        #region Remove
        private void RemoveItemFromArticleDept(int artcleDept)
        {
            List<ArticleDept> article = GetAllArticleDeptByID(artcleDept);
            _context.ArticleDept.RemoveRange(article);
            _context.SaveChanges();
        }
        #endregion
        #region Update

        private void UpdateArticleObject(Article newArticle, int articleID)
        {
            Article oldArticle = GetOneArticleByID(articleID);
            oldArticle.Name = newArticle.Name;
            oldArticle.Title = newArticle.Title;
            oldArticle.WeekMonth = newArticle.WeekMonth;
            oldArticle.NumberOfWeeks = newArticle.NumberOfWeeks;
            oldArticle.ArticlePath = newArticle.ArticlePath;
            oldArticle.UserCreator = newArticle.UserCreator;
        }


        #endregion
        #region Insert
        private void InsertDataToArticleDeptTable(int articleID, string deptID)
        {
            List<string> result = deptID.Split(new char[] { ',' }).ToList();
            foreach (var r in result)
            {
                _context.ArticleDept.Add(new ArticleDept() { ArtID = articleID, DeptID = int.Parse(r) });
            }
            _context.SaveChanges();
        }
        #endregion
        #region Add
        private void AddDataToDataBase(Article article, string deptID)
        {
            _context.Article.Add(article);
            _context.SaveChanges();
            InsertDataToArticleDeptTable(article.IdArticle, deptID);

        }
        #endregion

        #region Create
        private Article CreateNewArticleObject(List<string> valueList, string filePath, string userEmail)
        {
            Article article = new Article();
            article.Title = valueList[0];
            article.Name = valueList[4];
            article.UserCreator = userEmail;
            article.DateCreation = DateTime.Now;
            article.WeekMonth = valueList[2];
            article.NumberOfWeeks = int.Parse(valueList[3]);
            article.ArticlePath = filePath;

            return article;
        }

        #endregion

        #region Get Item
        private Article GetOneArticleByID(int articleID)
        {
            return _context.Article.Where(w => w.IdArticle == articleID).FirstOrDefault();
        }
        private List<UserArticle> GetUserArticles(int articleID)
        {
            return _context.UserArticle.Where(w => w.ArtID == articleID).ToList();
        }
        private List<ArticleDept> GetArticlesDept(int articleID)
        {
            return _context.ArticleDept.Where(w => w.ArtID == articleID).ToList();
        }
        private List<ArticleDept> GetAllArticleDeptByID(int articleID)
        {
            return _context.ArticleDept.Where(w => w.ArtID == articleID).ToList();
        }
        private List<string> GetDataFromFormCollection(IFormCollection name)
        {
            return name.Select(S => S.Value.ToString()).ToList();
        }
        #endregion
        public async Task<IActionResult> DownloadFileFromFileSystem(int id)
        {
            var file = _context.Article.Where(x => x.IdArticle == id).Select(s => s.ArticlePath).FirstOrDefault();
            //var memory = new MemoryStream();
            //using (var stream = new FileStream(file, FileMode.Open))
            //{
            //    await stream.CopyToAsync(memory);
            //}
            //memory.Position = 0;
            var p = System.IO.File.ReadAllBytes(file);

            var c = File(p, GetContentType(file), Path.GetFileName(file));
            return c;
        }
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats officedocument.spreadsheetml.sheet"},  
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
        private void ChangeDeadLineForArticleToRead(int articleID, string weeksMonths, int numberOfWeeks)
        {
            List<UserArticle> userArticles = _context.UserArticle
                .Where(w => w.ArtID == articleID)
                .ToList();

            DateTime returnDateTime = DateTime.Now;
            if (weeksMonths == "weeks")
            {
                var days = numberOfWeeks * 7;
                returnDateTime = DateTime.Now.AddDays(days);
            }
            else
            {
                returnDateTime = DateTime.Now.AddMonths(numberOfWeeks);
            }

            for (int i = 0; i < userArticles.Count; i++)            
            {
                
                userArticles[i].DeadLineForArticle = returnDateTime;
            }
            _context.SaveChanges();
        }
    }
}
