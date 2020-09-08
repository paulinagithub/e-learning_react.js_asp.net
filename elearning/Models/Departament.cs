using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace elearning.Models
{
    public class Departament
    {
        [Key]
        public int DeptID { get; set; }
        [Required]
        [Column(TypeName = "varchar(1000)")]
        public string Name { get; set; }

    }
}
