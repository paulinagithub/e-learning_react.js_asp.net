using Microsoft.EntityFrameworkCore;


namespace elearning.Models
{
    public class ElearningContext : DbContext
    {
        public ElearningContext(DbContextOptions<ElearningContext> options)
          : base(options)
        {
        }
        public DbSet<Article> Article { get; set; }
        public DbSet<Departament> Departament { get; set; }
        public DbSet<ArticleDept> ArticleDept { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserArticle> UserArticle { get; set; }
        public DbSet<UserLogin> UserLogin { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Article>().ToTable("Article");
            modelBuilder.Entity<Departament>().ToTable("Departament");
            modelBuilder.Entity<Departament>().HasData(
                    new { DeptID = 1, Name = "Zasoby Ludzkie" },
                    new { DeptID = 2, Name = "Marketing" },
                    new { DeptID = 3, Name = "IT" },
                    new { DeptID = 4, Name = "Obsługa klienta" },
                    new { DeptID = 5, Name = "Księgowość" },
                    new { DeptID = 6, Name = "Administracja" });
            modelBuilder.Entity<ArticleDept>().ToTable("ArticleDept");
            modelBuilder.Entity<UserArticle>().ToTable("UserArticle");
            modelBuilder.Entity<User>().HasData(
                    new
                    {
                        UserID = 1,
                        FirstName = "Jan",
                        LastName = "Kowalski",
                        DepartamentID = 3,
                        Position = "Administrator systemu"
                    },
                     new
                     {
                         UserID = 2,
                         FirstName = "Pawel",
                         LastName = "Kowalski",
                         DepartamentID = 1,
                         Position = "HR"
                     }
                );

            modelBuilder.Entity<UserLogin>().HasData(
             new
             {
                 ID = 1,
                 UserID = 1,
                 Email = "paulina@gmail.com",
                 Passward = "1234",
                 IsAdmin = true
             },
              new
              {
                  ID = 2,
                  UserID = 2,
                  Email = "paulina1@gmail.com",
                  Passward = "1234",
                  IsAdmin = false
              }
         );

        }
    }
}
