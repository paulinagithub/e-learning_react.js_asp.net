using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string FirstName { get; set; }
        [Required]
        [Column(TypeName = "varchar(1000)")]
        public string LastName { get; set; }

        [Column(TypeName = "int")]
        public int DepartamentID { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string Position { get; set; }


    }
}
