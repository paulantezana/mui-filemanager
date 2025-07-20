import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

export const COLOR_MOV_NARANJA = `#f84700`;
export const headerMinHeight = 50;
export const primaryColor = `#f84700`;

export const FONTS = [
  { id: 1, label: `sofia-extra`, descripcion: `Sofia Sans Extra Condensed` },
  { id: 2, label: `roboto-flex`, descripcion: `Roboto Flex` },
  { id: 3, label: `sans-serif`, descripcion: `Sans Serif` },
  { id: 4, label: `segoe-ui`, descripcion: `Segoe UI` },
  { id: 5, label: `helvetica-neue`, descripcion: `Helvetica Neue` },
  { id: 6, label: `arial`, descripcion: `Arial` },
]


export const globalFamily = (props) => {
  if (!props) return

  return {
    fontFamily: `'${FONTS[1].descripcion}', 'Helvetica', 'Arial', 'Sans-Serif' !important`,
    fontSize: Number(props.size),
  }
}

export const baseTheme = (props) =>
  createTheme({
    typography: {
      ...globalFamily(props),
    },
    palette: {
      primary: {
        main: COLOR_MOV_NARANJA,
      },
      secondary: {
        main: `#f50057`,
      }
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            ...globalFamily(props),
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            '&::-webkit-scrollbar': {
              width: `0px`,
              backgroundColor: 'transparent',
            },
          },
          '.swal2-title': {
            fontWeight: 400,
          },
          '.swal2-container': {
            zIndex: `9999 !important`,
          },
          '.swal2-styled': {
            ...globalFamily(props),
          },
          '.swal2-textarea': {
            ...globalFamily(props),
          },
          // '.swal2-html-container': {
          //   minHeight: `200px`,
          //   maxHeight: `200px`,
          //   overflowY: `auto`,
          // },
          '& .datagrid-descripcion-nivel0': {
            fontWeight: `bold`,
          },
          '.MuiDataGrid-columnHeaderTitleContainerContent': {
            flex: 1,
          }
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            fontSize: 15
          }
        }
      },
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            fontSize: Number(props.gridSize),
          },
          columnHeader: {
            fontSize: Number(props.gridSize),
            backgroundColor: primaryColor,
          },
          columnHeaderTitleContainer: {
            color: `#FFFFFF`
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            '&::-webkit-scrollbar': {
              width: `5px`,
              backgroundColor: `#e0e0e0`
            },
            '&::-webkit-scrollbar-track': {
              borderRadius: `10px`,
              backgroundColor: `#F5F5F5`
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: `10px`,
              backgroundColor: `#e0e0e0`,

              '&:hover': {
                backgroundColor: `#949393`
              },
            }
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: `${headerMinHeight}px !important`,
          },
        },
      },
      // MuiBreadcrumbs: {
      //   styleOverrides: {
      //     root: {
      //       position: 'absolute',
      //       left: '62px',
      //       top: '26px'
      //     },
      //   },
      // },
      MuiLink: {
        defaultProps: {
          underline: 'none'
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fontSize: 21,
          },
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            ...globalFamily(props),
          },
          adornedEnd: {
            paddingRight: 3,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: COLOR_MOV_NARANJA
          }
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            ...globalFamily(props),
          }
        }
      },
    },
  });

export const LayoutTheme = ({ children }) => {
  const size = 11;
  const family = FONTS[0].descripcion;

  const gridFamily = FONTS[0].descripcion;
  const gridSize = 11;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={baseTheme({ size, family, gridFamily, gridSize })}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};