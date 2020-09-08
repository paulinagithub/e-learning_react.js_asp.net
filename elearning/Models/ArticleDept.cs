using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class ArticleDept
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("Article")]
        public int ArtID { get; set; }
        [ForeignKey("Departament")]
        public int DeptID { get; set; }
        
    }
}
