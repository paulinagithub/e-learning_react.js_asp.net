using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class UserArticle
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("Article")]
        public int ArtID { get; set; }
        [ForeignKey("User")]
        public int UserID { get; set; }
        [Column(TypeName = "bit")]
        public bool isRead { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DeadLineForArticle { get; set; }

    }
}
