export const menuItems = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: "Home",
  },
  {
    name: "Data User",
    url: "/admin/users",
    icon: "Users",
  },
  {
    name: "Data Lowongan",
    icon: "Briefcase",
    submenus: [
      {
        name: "Scraping Data Pekerjaan",
        url: "/admin/scraping",
      },
      {
        name: "Lowongan Pekerjaan",
        url: "/admin/lowongan",
        activeWhen: ["/admin/lowongan", "/admin/lowongan/detail"],
      },
    ],
  },
  {
    name: "Data Report",
    url: "/admin/report",
    icon: "ChartBar",
    activeWhen: ["/admin/report", "/admin/report/detail"],
  },
];
