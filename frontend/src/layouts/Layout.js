import React, { useContext, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from '@mui/material/Paper';

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useNavigate, useLocation } from "react-router-dom";

/**
 * Layout
 *
 * @See See Material-UIs [Drawers] (https://mui.com/components/drawers/)
 * @See See Material-UIs [App Bar] (https://mui.com/components/app-bar/)
 */

const drawerWidth = 240;

/** Menu Items */

  const menu = [
    {
      name: "Home",
      nav: "/",
      icon: "HomeIcon",
    }
  ];
const secMenu = [
  {
    name: "Einstellungen",
    nav: "/settings",
    icon: "AccountBoxIcon",
  }
];

/**
 * Setzt den Namen rechts vom Drawer, je nachdem auf welcher Seite sich der Nutzer befindet.
 *
 * @returns pathname
 */
const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

/** Sorgt für Anpassung der Seite beim öffnen des Drawers. */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

/** Styled den Drawer-Kopf. */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

/**
 * Drawer mit eingebundenem Account-Menü.
 *
 * @param {*} children
 * @returns Layout
 */
export default function Layout({children}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);


  /** Ernöglicht die Weiterleitung zu einer Seite und schließt dabei den Drawer. */
  function navigateTo(link) {
    handleDrawerClose();
    navigate(link);
  }

  /** Ermöglich das Öffnen und Schließen des Drawers. */
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  /** Ermöglicht das Öffnen und Schließen des Account-Menüs */
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /** Füllt das Account-Menü mit Werten */
  const settings = [
  {
    name: "Account",
  },
  {
    name: "DarkMode",
  },
  {
    name: "Logout",
  }
]
  const [anchorElUser, setAnchorElUser] = useState(null);

  return (
    <div className="">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {usePathname()}
            </Typography> 
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="temporary"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon sx={{ color: "black" }} />
              ) : (
                <ChevronRightIcon sx={{ color: "black" }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <>
            {menu.map((item, index) => (
              <ListItem button onClick={() => navigateTo(item.nav)} key={index}>
                <ListItemIcon sx={{ color: "black" }}>
                  {index === 0 && <ViewAgendaIcon key={item.icon} />}
                </ListItemIcon>
                <ListItemText key={item.name} primary={item.name} />
              </ListItem>
            ))}
          <Divider />
          </>
          <Divider />
          <Divider />
          <List>
            {secMenu.map((item, index) => (
              <ListItem
                button
                onClick={() => navigateTo(item.nav)}
                key={item.nav}
              >
                <ListItemIcon sx={{ color: "black" }}>
                  {index === 0 && <AccountBoxIcon key={item.icon} />}
                </ListItemIcon>
                <ListItemText key={item.name} primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    </div>
  );
}