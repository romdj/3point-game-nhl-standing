const moment = require('moment');

const getCurrentSeason = () => {
  if (moment().month() >= 9 && moment().month() <= 12)
    return `${moment().year()}${moment().year() + 1}`;
  return `${moment().year() - 1}${moment().year()}`;
};
const nhlAPIURL = "https://statsapi.web.nhl.com/api/v1/";
const seasonInUse = getCurrentSeason();
const intervalStartDate = `${seasonInUse.slice(0, 4)}-09-01`;
const intervalEndDate = `${seasonInUse.slice(4, 8)}-09-01`;
const from = `?startDate=${intervalStartDate}`;
const to = `&endDate=${intervalEndDate}`;
const nhlCompleteScheduleURL = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${seasonInUse}`;

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: `gatsby-source-graphql`,
    //   options: {
    //     typeName: `Schedule21`,
    //     fieldName: `schedule_2020-2021`,
    //     url: "https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.linescore&season=20202021",
    //     headers: {
    //       Authorization: `Bearer your-github-token`,
    //     },
    //   },
    // },
    {
      resolve: `gatsby-plugin-typescript`,
      // options: {
      // isTSX: true, // defaults to false
      // jsxPragma: `jsx`, // defaults to "React"
      // allExtensions: true, // defaults to false
      // },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    // {
    //   resolve: "gatsby-source-apiserver",
    //   options: {
    //     data: {},
    //     method: "get",
    //     url: `https://statsapi.web.nhl.com/api/v1/teams`,
    //     entitiesArray: [
    //       {
    //         url: `https://statsapi.web.nhl.com/api/v1/teams`,
    //         method: "get",
    //         data: {},
    //       }
    //     ]
    //   }
    // },

    // {
    //   resolve: 'gatsby-source-rest-api',
    //   options: {
    //     endpoints: [
    //       "https://statsapi.web.nhl.com/api/v1/teams",
    //       // "https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.linescore&season=20202021",
    //     ],
    //   },
    // },
  ],
}
