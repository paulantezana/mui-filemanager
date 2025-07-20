import dayjs from 'dayjs';
import _ from 'lodash';
import * as xlsx from 'xlsx';

import Util from 'utils/Util';
import { FONTS, PE_DATE_FORMAT, US_DATE_FORMAT } from './constants';
import { multDivMultiplication, ParametersObtenerDataControl } from './defaultValues';
import axiosHttp from 'apis/axiosInstance';

export const setTitleDocument = (empresaRazonSocial) =>{
  const isReportWindow = window.location.pathname.includes(`/reportes/visualizador`);
  return document.getElementById(`documentTitle`).innerHTML = `Back Office - ${isReportWindow ? `Reporte` : empresaRazonSocial}`;
}

const assembleParameters = (
  arrParams,
  values,
  codigoUsuario,
  maxInvalidValuesCount = -1,
) => {
  let cancelAssemble = false;
  let invalidValuesCount = 0;
  
  const valuesForm = _.mapKeys(values, (v,k) => _.lowerFirst(k))

  const parametersFilter = arrParams.filter((param) => param.indexOf(ParametersObtenerDataControl.PrefixFieldsNotAssemble) === -1);

  const fieldsIdCount = parametersFilter.reduce(
    (acu, param) => acu + (param.substring(0, 2) === 'Id' ? 1 : 0),
    0
  );

  const parameters = parametersFilter
    .map((param) => {
      let value = '';

      switch (param) {
        case ParametersObtenerDataControl.ScreenCode:
          value = valuesForm[`pantalla`];
          break;
        case ParametersObtenerDataControl.UserAuth.code:
          value = codigoUsuario;
          break;
        case ParametersObtenerDataControl.Descriptions:
          break;

        default:
          const fullKey = _.lowerFirst(param);

          if(_.isUndefined(valuesForm[fullKey])) value = null;

          value = 
            valuesForm[fullKey] !== undefined
              ? valuesForm[fullKey]
              : Util.deepSearchValueInObjectByKey(valuesForm, fullKey);

          if(typeof value === 'object'){
            value = dayjs(value).isValid() 
              ? Util.formatDate(value, US_DATE_FORMAT)
              : Util.esNullOUndefinedoEmpty(value?.valor) ? null : value?.valor
          }

          (value === undefined || value === null) && (value = '');
      }

      if (
        maxInvalidValuesCount > -1 &&
        (value === null ||
          value === 'Invalid Date' 
            // || (param.substring(0, 2) === 'Id' && (parseInt(value) === 0 /*|| value === ''*/))
        )
      ) {
        invalidValuesCount++;

        if (
          invalidValuesCount > maxInvalidValuesCount ||
          invalidValuesCount === fieldsIdCount
        )
          cancelAssemble = true;
      }

      if (param === '' && value === '') return '';

      return `${param}:${value}`;
    })
    .join('|');

  if (cancelAssemble) return false;

  return parameters;
};

export const assembleParametersToObtenerDataControl = (
  arrParams,
  storeProcedureName,
  tipoComponente,
  valuesForm,
  codigoUsuario,
  screenCode,
  field,
) => {
  const parameters = assembleParameters(arrParams, valuesForm, codigoUsuario, 0);

  if (parameters === false) return false;

  return `${ParametersObtenerDataControl.NombreSP}=${storeProcedureName}&${ParametersObtenerDataControl.TipoComponente}=${tipoComponente}&${ParametersObtenerDataControl.DynamicParameters}=${parameters}&${ParametersObtenerDataControl.Pantalla}=${screenCode}&${ParametersObtenerDataControl.Campo}=${field}`;
};

export const assembleParametersToObtenerDataToValidateControl = (
  arrParams,
  storeProcedureName,
  valuesForm,
  codigoUsuario,
) =>
  `${ParametersObtenerDataControl.NombreSP}=${storeProcedureName}&${
    ParametersObtenerDataControl.DynamicParameters
  }=${assembleParameters(arrParams, valuesForm, codigoUsuario)}`;

export const assembleDependenciesByControl = (dependencies, valuesForm) =>
  dependencies &&
  dependencies
    .filter(
      (param) =>
        ![
          ParametersObtenerDataControl.Descriptions,
          ParametersObtenerDataControl.UserAuth.code,
        ].includes(param)
    )
    .map((param) => {
      let value;

      const paramLowerCaseFirstLetter = Util.lowerCaseFirstLetter(param);

      value =
        valuesForm[paramLowerCaseFirstLetter] !== undefined
          ? valuesForm[paramLowerCaseFirstLetter]
          : Util.deepSearchValueInObjectByKey(
              valuesForm,
              paramLowerCaseFirstLetter
            );

      value === undefined && (value = '');

      return value;
    });

export const assembleVariantsToGetStoreProcedure = (arrVariants, valuesForm) =>
  assembleParameters(arrVariants, valuesForm);

export const assembleParametersToGetProposedControl = (
  arrParams,
  storeProcedureName,
  valuesForm,
  codigoUsuario,
  verifyInvalidValuesCount = -1
) => {
  const parameters = assembleParameters(
    arrParams,
    valuesForm,
    codigoUsuario,
    verifyInvalidValuesCount
  );

  if (parameters === false) return parameters;

  return `${ParametersObtenerDataControl.NombreSP}=${storeProcedureName}&${ParametersObtenerDataControl.DynamicParameters}=${parameters}`;
};

export const groupByVariants = (arrProposals, keyVariant) => {
  const arrGrouped = [];

  arrProposals.forEach(
    (proposed) =>
      proposed[keyVariant] &&
      proposed[keyVariant].split('|').forEach((variant) => {
        const fieldVariant = variant.split(':')[0];
        !arrGrouped.includes(fieldVariant) && arrGrouped.push(fieldVariant);
      })
  );

  return arrGrouped;
};

export const rounded = (num) => Math.round(num * 100) / 100;

export const roundedFixed2 = (num) => Number(rounded(num).toFixed(2));

export const solveOperation = (num1, num2, multDiv) =>
  rounded(multDiv === multDivMultiplication ? num1 * num2 : num1 / num2);

export const getBlobFile = async (url, data) => {
  const response = await axiosHttp.post( url, data, { responseType: `blob` })
  return response.data;
}

export function downloadBlobFile (blob, entity, ext) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${entity}.${ext}`;
  document.body.appendChild(link); // we need to append the element to the dom -> otherwise it will not work in firefox
  link.click();
  link.remove(); //afterwards we remove the element again
}

export function xlsToJson(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: 'array' })
      console.log("Sheetname", workbook.SheetNames);
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet,{ header: 1 });
      resolve(json)
    }
    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export function filterObject1BasedInObject2(o1, o2) {
  return Object.fromEntries(
    Object.entries(o1).filter(
      ([key]) => Object.keys(o2).includes(key)
    )
  );
}

export const botonesGeneral = ['notas','adjuntos','verReporte','vincular','copiarLineas','copiarPagos','liberar','acciones']
export const botonesReportes = ['pivot', 'excel']

export const getArrayDifference = (arr1, arr2) => {
  let firstArr = arr1.length > arr2.length ? arr1 : arr2
  let secondArr = arr1.length > arr2.length ? arr2 : arr1
  
  return firstArr.filter(r => !secondArr.find(w => w === r))
}

export const SqlLikeWordOnArray = (array, word) => {
  //Si el array no existe, no hacer nada. 
  if(_.isEmpty(array)) return
  // Si el word es nil, entonces setearlo como vacio.
  if(_.isNil(word)) return [...array]
  //Contar cantidad de asteriscos
  const qtyAsteriscos = [...word].filter(r => r === '*').length
  // Si la cantidad es menor a 1 o mayor a 2, salir.
  if(qtyAsteriscos < 0 || qtyAsteriscos > 2 ) return
  
  const wordUpper = word.toUpperCase()
  
  //Si no hay asteriscos, hacer un filtrado normal
  if(qtyAsteriscos === 0){
    return [...array].filter(r => String(r.code + r.description )?.toUpperCase().includes(wordUpper))
  }
  
  //Filtrar inicialmente el array para hacerlo más pequeno
  const filteredArray = [...array].filter(r => String(r.code + r.description )?.toUpperCase().includes(wordUpper.replace(/\*/g,'')) )
  
  return filteredArray.filter(r => {
    const item = String(r.code + r.description )?.toUpperCase()
    // Si es 1.
	  if(qtyAsteriscos === 1){
      // Ver si esta al inicio o al final y filtrar.
      const isCharOnInit = word.indexOf('*') === 0
    	if(isCharOnInit) return item.endsWith(wordUpper.slice(1))
      return item.startsWith(wordUpper.slice(0,-1))
    }
    //Si es 2. Verificar que se encuentren al inicio y final
  	//Si no esta al inicio y si no esta al final , no hacer nada.
    if(word.indexOf('*') !== 0 && word.lastIndexOf('*') !== word.length - 1) return []
    return item.slice(1,-1).includes(wordUpper.slice(1,-1))  
  })
}

export const dataMockup = {
  title: 'Lista de Entidades',
  urlNew: '/Administracion/Maestros/Mantenimiento/EntidadCompania',
  views: ['Vista 1', 'Vista 2', 'Vista 3', 'Vista 4', 'Vista 5', 'Sin Registros'],
  options: [
    {
      id: 1,
      valor: '20518915119',
      description: 'Minería Corporativa SAC',
      descriptionExtra: ['Minería Corporativa SAC', '20518915119', 'MINCORP'],
      url: '/Administracion/Maestros/Mantenimiento/EntidadCompania',
      recent: 1,
      view1: 1,
      view2: 0,
      view3: 0,
      view4: 0,
      view5: 0,
      view6: 0,
    },
    {
      id: 2,
      valor: '10072781193',
      description: 'FESPA',
      descriptionExtra: ['FESPA', '10072781193', 'FESPA'],
      url: '/Administracion/Maestros/Mantenimiento/EntidadCompania',
      recent: 1,
      view1: 0,
      view2: 1,
      view3: 0,
      view4: 0,
      view5: 0,
      view6: 0,
    },
  ],
};

export const moveToFirstPositionByDescription = (array, item) => {
  const toIndex = 0;

  if(typeof item === 'object'){
    // Encontrar objeto y colocarlo en primera posición
    const foundObject = _.find(array, o => o.id === item.id);
    const arrayWithoutObject = _.without(array, foundObject);
    const updatedArray = _.concat([foundObject], arrayWithoutObject);
    return updatedArray;
  }

  const fromIndex = array.findIndex(r => r.description === item)
  const element = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, element);
  return array
}

export const getDescripcionControl = (entityData, field) => 
  entityData[`descripcionControl${field}`] ?? entityData[`descripcion${field}`]

export const escapeRegExp = (value) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const keysId = ['idLote', 'id']

export const globalSettings = JSON.parse(localStorage.getItem('globalSettings'))

export const globalFamily = (props) => {
  if(!props) return 
  
  return {
    fontFamily: `'${FONTS[props.family - 1].descripcion}', 'Helvetica', 'Arial', 'Sans-Serif' !important`,
    fontSize: Number(props.size),
  }
}

export const filterArrayWithAsterisk = (array, searchValue/*, columnIndex = null*/) => {
  // setSearchText(searchValue);
  console.log(array);

  const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');

  const wordUpper = searchValue.toUpperCase()
  const isCharOnInit = wordUpper.indexOf('*') === 0
  const isCommonSearch = wordUpper.indexOf('*') === -1

  // if(columnIndex) {
  //   console.log(`Buscó con index`)
  //   const response = array.filter((row) => {
  //     const textToSearch = String(row[columnIndex])
  //     console.log(textToSearch);

  //     if(isCharOnInit) return textToSearch.endsWith(wordUpper.slice(1))
  //     if(isCommonSearch) return searchRegex.test(textToSearch);

  //     return textToSearch.startsWith(wordUpper.slice(0,-1));
  //   })

  //   return response
  // }

  const response = array.filter((row) => {
    return Object.keys(row).some((field) => {
      const textToSearch = String(row[field]);
      
      if(isCharOnInit) return textToSearch.endsWith(wordUpper.slice(1))
      if(isCommonSearch) return searchRegex.test(textToSearch);

      return textToSearch.startsWith(wordUpper.slice(0,-1));
    });

  });

  console.log(response);

  return response
}

// debounce function
export const debounce = (func, wait = 500) => {
  let timeout;
  
  const debounced = (...args) => {
    const later = () => {
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
}

export const checkIfArrayOfObjectsRepeatValues = ( array, property ) => {
  const valores = _.uniqBy(array, property);
  if(valores.length !== array.length)
    throw new Error(`Hay valores repetidos de la propiedad ${property}.`);
}

export const getRepeatedValueOnArray = ( array, property ) => {
  const valores = new Set();
  for (let item of array) {
    if (valores.has(item[property]))
        throw new Error(`El valor "${item[property]}" se repite de la propiedad label`);
    valores.add(item[property]);
  }
}

export const forzarFechaADiezDigitos = (date) => {
  // Expresión regular para validar y capturar grupos: día, mes y año
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (!regex.test(date)) {
      return null; // Retornar null si el formato no es válido
  }

  // Extraer el día, mes y año utilizando la expresión regular
  const [, day, month, year] = date.match(regex);

  // Formatear el día y mes para que siempre tengan 2 dígitos
  const dayFormatted = day.padStart(2, '0');
  const monthFormatted = month.padStart(2, '0');

  // Retornar la fecha en formato DD/MM/YYYY
  return `${dayFormatted}/${monthFormatted}/${year}`;
}

export const forceDateTo10Digits = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const formattedDate = [
    day.padStart(2, '0'), 
    month.padStart(2, '0'), 
    year
  ].join('/');
  
  return formattedDate;
}

export const esComboGeneralOMultiCombo = (text) => [`combogeneral`,`multicombo`].includes(text)

export const companiesByEnvironmentUpdate = (empresasSeleccionadas = []) => {
  const companiesByEnvironment = JSON.parse(localStorage.getItem(`companiesByEnvironment`)) ?? [];
  const environment = localStorage.getItem(`environment`);

  const companiesByEnvironmentUpdated = ({ 
    ...companiesByEnvironment, 
    [environment]: [ 
      ...empresasSeleccionadas,
    ]
  });

  localStorage.setItem(`companiesByEnvironment`, JSON.stringify(companiesByEnvironmentUpdated));
}

export const updateAllVisibleToTrue = (obj) => {
  return _.mapValues(obj, (value) => {
    // If this is an object with a visible property
    if (_.isObject(value) && value !== null && 'visible' in value) {
      // Return a new object with visible set to true
      return {
        ...value,
        visible: true
      };
    }
    return value;
  });
};
export const getListFromUrlNew = (word) => word && String(word).substring(0, word.lastIndexOf(`/Form`));