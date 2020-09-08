using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class Article
    {
        [Key]
        public int IdArticle { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Title { get; set; }
        [Required]
        [Column(TypeName = "varchar(1000)")]
        public string Name { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string UserCreator { get; set; }
        [Required]
        [Column(TypeName = "datetime")]
        public DateTime DateCreation { get; set; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string WeekMonth { get; set; }
        [Required]
        [Column(TypeName = "int")]
        public int NumberOfWeeks { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string ArticlePath { get; set; }


    }
}
