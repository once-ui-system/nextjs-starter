export const BoMenuLink:BoMenuLink[] = [
    { title: "DARIN.BET", passHref: true },
    {
        title: "AG", iconR: 'Sword_Rose', passHref: true,
        subMenu: [
            { title: "Transfer", href: "/transfer", iconR: 'Currency_Exchange' },
            { title: "สมาชิก", href: "/userlist", iconR: "Group" },
            { title: "LineOA", href: "/lineuser", iconR: "Group" },

        ]
    },
    {
        title: "Setting", iconR: 'tune', passHref: true,
        subMenu: [
            { title: "ค่ายเกมส์", href: "/bfxprovider", iconR: "Sword_Rose" },
            { title: "บช.", href: "/setting", iconR: 'Currency_Exchange' },
            { title: "Contents", href: "/article", iconR: "Kid_Star" },
            { title: "ทางเข้า", href: "/entranceurl", iconR: "Group" },

        ]
    },
    {
        title: "สำหรับทดสอบระบบ", iconR: 'Phone_Enabled', passHref: true,
        subMenu: [
            { title: "PreviewUI", href: "/previewui", prefetch: false },
            { title: "Push", href: "/push", prefetch: true },
        ]
    }
]
