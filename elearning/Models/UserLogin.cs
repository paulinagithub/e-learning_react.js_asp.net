using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class UserLogin
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("User")]
        public int UserID { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Email { get; set; }
        [Required]
        [Column(TypeName = "varchar(1000)")]
        public string Passward { get; set; }
        [Column(TypeName = "bit")]
        public bool IsAdmin { get; set; }
    }
}
