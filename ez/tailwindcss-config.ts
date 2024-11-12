/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme"
import plugin from 'tailwindcss/plugin'
import path from "path"

const timing = 300

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./ez/**/*.{js,ts,jsx,tsx,mdx}",
   // path.join(path.dirname(require.resolve("@dsv911/ez/src")), "**/*.{js,ts,jsx,tsx,mdx,css}"),
   // path.dirname(require.resolve("@dsv911/ez/style")),
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      noto: ["Noto Sans Thai", 'Noto Sans', "Noto Sans Thai Looped", "extralight",
        "light",
        "regular",
        "medium",
        "semibold",
        "bold",
        "extrabold",],

    },
    aniDelay: {
      0: timing * 0,
      1: timing * 1,
      2: timing * 2,
      3: timing * 3,
      4: timing * 4,
      5: timing * 5,
      6: timing * 6,
      7: timing * 7,
      8: timing * 8,
      9: timing * 9,
      10: timing * 10,
      11: timing * 11,
      12: timing * 12,
      13: timing * 13,
      14: timing * 14,
      15: timing * 15,
      16: timing * 16,
      17: timing * 17,
      18: timing * 18,
      19: timing * 19,
      20: timing * 20,
      21: timing * 21,
      22: timing * 22,
      23: timing * 23,
      24: timing * 24,
      25: timing * 25,
      26: timing * 26,
      27: timing * 27,
      28: timing * 28,
      29: timing * 29,
      30: timing * 30,
      31: timing * 31,
      32: timing * 32,
      33: timing * 33,
      34: timing * 34,
      35: timing * 35,
      36: timing * 36,
      37: timing * 37,
      38: timing * 38,
      39: timing * 39,
      40: timing * 40,
      41: timing * 41,
      42: timing * 42,
      43: timing * 43,
      44: timing * 44,
      45: timing * 45,
      46: timing * 46,
      47: timing * 47,
      48: timing * 48,
      49: timing * 49,
      50: timing * 50,
      51: timing * 51,
      52: timing * 52,
      53: timing * 53,
      54: timing * 54,
      55: timing * 55,
      56: timing * 56,
      57: timing * 57,
      58: timing * 58,
      59: timing * 59,
      60: timing * 60,
      61: timing * 61,
      62: timing * 62,
      63: timing * 63,
      64: timing * 64,
      65: timing * 65,
      66: timing * 66,
      67: timing * 67,
      68: timing * 68,
      69: timing * 69,
      70: timing * 70,

    },

    screens: {
      "2xsm": "375px",
      "1xsm": "450px",
      xsm: "540px",
      "m2xsm": { 'max': "375px" },
      "m1xsm": { 'max': "450px" },
      mxsm: { 'max': "540px" },
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    backgroundImage: {
      royal: "linear-gradient(to bottom right, #243B55, #141E30)",
      gold: "linear-gradient(to bottom right, #F2C94C, #F2994A)",
      luxury: "linear-gradient(to bottom, #24243e, #302b63, #0f0c29)",
      bfx: "linear-gradient(to bottom right, #7774fd, #630579)",
      mystic: "linear-gradient(to bottom right, #D7DDE8, #757F9A)",
      darkbtn: "linear-gradient(to right, #434343, #000000)",

      ...defaultTheme.backgroundImage
    },

    extend: {
      aria: {
        asc: 'sort="ascending"',
        desc: 'sort="descending"',
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        red: "#FB5454",
        body: "#64748B",
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        primary: "#3C50E0",
        secondary: "#80CAEE",
        stroke: "#E2E8F0",
        gray: "#EFF4FB",
        graydark: "#333A48",
        "gray-2": "#F7F9FC",
        "gray-3": "#FAFAFA",
        whiten: "#F1F5F9",
        whiter: "#F5F7FD",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3d4d60",
        "form-input": "#1d2a39",
        "meta-1": "#DC3545",
        "meta-2": "#EFF2F7",
        "meta-3": "#10B981",
        "meta-4": "#313D4A",
        "meta-5": "#259AE6",
        "meta-6": "#FFBA00",
        "meta-7": "#FF6766",
        "meta-8": "#F0950C",
        "meta-9": "#E5E7EB",
        "meta-10": "#0FADCF",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        "hover": "#0003",
        "dark-hover": "#FFF3",
      },

      fontSize: {
        "title-xxl": ["44px", "55px"],
        "title-xxl2": ["42px", "58px"],
        "title-xl": ["36px", "45px"],
        "title-xl2": ["33px", "45px"],
        "title-lg": ["28px", "35px"],
        "title-md": ["24px", "30px"],
        "title-md2": ["26px", "30px"],
        "title-sm": ["20px", "26px"],
        "title-sm2": ["22px", "28px"],
        "title-xsm": ["18px", "24px"],
      },
      spacing: {
        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        21: "5.25rem",
        22: "5.5rem",
      },
      maxWidth: {

        3: "0.75rem",
        4: "1rem",
        7: "1.75rem",
        9: "2.25rem",
        10: "2.5rem",

        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",

        25: "6.25rem",
        30: "7.5rem",
        34: "8.5rem",
        35: "8.75rem",
        40: "10rem",

        44: "11rem",
        45: "11.25rem",
        60: "15rem",
        70: "17.5rem",
        90: "22.5rem",
        94: "23.5rem",
        125: "31.25rem",


        150: "37.5rem",
        180: "45rem",
        203: "50.75rem",
        230: "57.5rem",

        270: "67.5rem",
        280: "70rem",
        ...defaultTheme.maxWidth
      },
      maxHeight: {
        35: "8.75rem",
        70: "17.5rem",
        90: "22.5rem",
        550: "34.375rem",
        300: "18.75rem",
        ...defaultTheme.maxHeight
      },
      minWidth: {
        75: "18.75rem", ...defaultTheme.maxWidth
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },

      opacity: {
        ...defaultTheme.opacity
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "21/9": "21 / 9",
      },
      content: {
        "icon-copy": 'url("../images/icon/icon-copy-alt.svg")',
      },

      transitionProperty: { translate: 'translate', width: "width", stroke: "stroke", anidelay: "animation-delay" },
      borderWidth: {
        6: "6px",
        10: "10px",
        12: "12px",
      },
      boxShadow: {
        default: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
        card: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        "card-2": "0px 1px 2px rgba(0, 0, 0, 0.05)",
        switcher:
          "0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 2px #FFFFFF, inset 0px -1px 1px rgba(0, 0, 0, 0.1)",
        "switch-1": "0px 0px 5px rgba(0, 0, 0, 0.15)",
        1: "0px 1px 3px rgba(0, 0, 0, 0.08)",
        2: "0px 1px 4px rgba(0, 0, 0, 0.12)",
        3: "0px 1px 5px rgba(0, 0, 0, 0.14)",
        4: "0px 4px 10px rgba(0, 0, 0, 0.12)",
        5: "0px 1px 1px rgba(0, 0, 0, 0.15)",
        6: "0px 3px 15px rgba(0, 0, 0, 0.1)",
        7: "-5px 0 0 #313D4A, 5px 0 0 #313D4A",
        8: "1px 0 0 #313D4A, -1px 0 0 #313D4A, 0 1px 0 #313D4A, 0 -1px 0 #313D4A, 0 3px 13px rgb(0 0 0 / 8%)",
        9: "0px 2px 3px rgba(183, 183, 183, 0.5)",
        10: "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
        11: "0px 1px 3px 0px rgba(166, 175, 195, 0.40)",
        12: "0px 0.5px 3px 0px rgba(0, 0, 0, 0.18)",
        13: "0px 1px 3px 0px rgba(0, 0, 0, 0.08)",
        14: "0px 2px 3px 0px rgba(0, 0, 0, 0.10)",
      },
      dropShadow: {
        1: "3px 3px 3px #000",
        2: "0px 1px 4px rgba(0, 0, 0, 0.12)",
        3: "0px 0px 4px rgba(0, 0, 0, 0.15)",
        4: "0px 0px 2px rgba(0, 0, 0, 0.2)",
        5: "0px 1px 5px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        ...defaultTheme.keyframes,
        hover: {
          "0%, 100%": { transform: "translate3d(0, 1%, 0)" },
          "50%": { transform: "translate3d(0, 0, 0)" },
        },
        linspin: {
          "100%": { transform: "rotate(360deg)" },
        },
        easespin: {
          "12.5%": { transform: "rotate(135deg)" },
          "25%": { transform: "rotate(270deg)" },
          "37.5%": { transform: "rotate(405deg)" },
          "50%": { transform: "rotate(540deg)" },
          "62.5%": { transform: "rotate(675deg)" },
          "75%": { transform: "rotate(810deg)" },
          "87.5%": { transform: "rotate(945deg)" },
          "100%": { transform: "rotate(1080deg)" },
        },
        "left-spin": {
          "0%": { transform: "rotate(130deg)" },
          "50%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(130deg)" },
        },
        "right-spin": {
          "0%": { transform: "rotate(-130deg)" },
          "50%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(-130deg)" },
        },
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        topbottom: {
          "0%, 100%": { transform: "translate3d(0, -100%, 0)" },
          "50%": { transform: "translate3d(0, 0, 0)" },
        },
        bottomtop: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -100%, 0)" },
        },
        line: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(100%)" },
        },
        "line-revert": {
          "0%, 100%": { transform: "translateY(100%)" },
          "50%": { transform: "translateY(0)" },
        },
      },

      animation: {
        ...defaultTheme.animation,
        linspin: "linspin 1568.2353ms linear infinite",
        easespin: "easespin 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "left-spin":
          "left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "right-spin":
          "right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "ping-once": "ping 5s cubic-bezier(0, 0, 0.2, 1)",
        rotating: "rotating 30s linear infinite",
        topbottom: "topbottom 60s infinite alternate linear",
        bottomtop: "bottomtop 60s infinite alternate linear",
        "spin-1.5": "spin 1.5s linear infinite",
        "spin-2": "spin 2s linear infinite",
        "spin-3": "spin 3s linear infinite",
        line1: "line 10s infinite linear",
        line2: "line-revert 8s infinite linear",
        line3: "line 7s infinite linear",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme })
    {
      matchUtilities(
        {
          'aniDelay': (value) => ({
            'animation-delay': `calc(${value}ms)`
          }),
        },
        { values: theme('aniDelay') }
      )
    }),
    require('@tailwindcss/forms'),
  ],
}

export default config
