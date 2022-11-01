export enum MessagesTst {
  //type message
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warn',
  SUCCESS = 'success',

  //Generic Messages
  INSERTERROR = 'Error al ingresar',
  UPDATEERROR = 'Error al actualizar',
  SAVEERROR = 'Error al guardar',
  ERROREJECTION = 'Error al ejecutar',
  INSERTSUCCESS = 'Igresado con éxito',
  DELETESUCCESS = 'Eliminado con éxito',
  DELETEERROR = 'No fue posible eliminar',
  UPDATESUCCESS = 'Actualizado con éxito',
  SAVESUCCESS = 'Guardado con éxito',
  NODATAERROR = 'Error al traer los datos',
  ERRORDATA = 'Debe llenar todos los campos',
  ERRORGETDATA = 'Error al traer los datos.',
  ERRORMAIL = 'No se pudo enviar el correo.',
  SUCSSESMAIL = 'Se envío el correo.',
  ERRORLIST = 'No fue posible obtener la lista',
  ERRORSTATE = 'No se ha podido cambiar el estado.',
  PASSWORDNOTEQUALS = 'Las contraseñas no son iguales',
  MISSINGDATA = 'Por Favor llene la información necesaria',
  ERRORPASSWORD = 'Hubo un error al modificar la contraseña',
  SUCSSEPASSWORD = 'Contrasena modificada satisfactoriamente',
  SUCCESSTATE = 'Se ha cambiado el estado satisfactoriamente.',
  ERRORLOGIN = 'Usuario y/o contraseña no válido, por favor verifique e intente nuevamente.',

  //Specific messages
  EXIST = 'La variable ya existe',
  PROFILEACTIVATED = 'Usuario activado',
  PROPERTYACTIVATED = 'Propiedad activada',
  VARIABLEACTIVATED = 'Variable activada',
  PERSONALIZATIONACTIVATED = 'Personalización activada',
  PROFILEINACTIVATED = 'Usuario inactivado',
  PROPERTYINACTIVATED = 'Propiedad inactivada',
  VARIABLEINACTIVATED = 'Variable inactivada',
  PLACEHOLDERACTIVATED = 'Placeholder activado',
  PLACEHOLDERINACTIVATED = 'Placeholder inactivado',
  PAGEACTIVATED = 'Página activada',
  PAGEINACTIVATED = 'Página inactivada',

  BLOCKACTIVATED = 'Bloque activado',
  BLOCKINACTIVATED = 'Bloque inactivado',
  BLOCKEXIST = 'La variable ya existe',

  PERSONALIZATIONINACTIVATED = 'Personalización inactivada',
  NOOPERATOR = 'No se agregó ningun operador.',
  EERORCROMA = 'Error al traer datos de Croma',
  PLACEHOLDEREXIST = 'El placeholder ya existe',
  ERRORROLE = 'Ya existe un role con ese nombre',
  ERRORACTION = 'Ya existe una acción con ese Id.',
  ERRORTAGSMA = 'Error al traer los tags de matomo',
  ERRORNUMNEWS = 'Cantidad de noticias no permitido',
  NOSUBCONDITION = 'No se agregaron subcondiciones.',
  PARAMETEREXIST = 'El parámetro ya existe',
  ERRORIMAGES = 'No se permite ingresar mas imágenes',
  VARIABLEEXIST = 'Ya existe una condición con ese Id.',
  ERRORSAVECONDITION = 'Error al guardar la condición.',
  CHANGESTATE = 'No fue posible cambiar el estado',
  ERRORCLASS = 'No se permite ingresar etiquetas class,js,css',
  ERRORIMAGE = 'Debe seleccionar una imágen',
  SUCCESSIMAGE = 'Imágen cargada',
  SUCCESSCOPY = 'Texto copiado con éxito',
  ERRORCOPY = 'Texto no copiado',
  SUCCESSLOAD = 'Añadido con éxito',
  ERRORCOMPLETEDATA = 'Dede completar la información necesaria',
  DOMAINEXIST = 'El dominio ya existe',
  EXISTTEMPLATE = 'El nombre de la plantilla ya existe',
  EERORCONDITION = 'Debe agregar la condición',
  PROFILESUPDATESUCCESS = 'Los perfiles se actualizaron correctamente',
  PROFILESUPDATEERROR = 'Los perfiles no se actualizaron correctamente',
  OPERATOR_REQUIRED = 'Debe agregar al menos un operador',
  RULEEXIST = 'La regla ya existe',
  NOSITE = 'No ha selecionado un sitio',
  ROLEUSED = 'El role que desea inactivar cuenta con un usuario asignado',

  //placehoders System
  Title = 'Title',
  Summary = 'Summary',
  Image = 'Image',
  EVENTNOVALUE = 'No se agregó ningun valor al tipo de evento.',
  REQVARVALUE = 'Debe existir al menos una variable con valor asignado.',
  VARIABLENOVALUE = 'No se pudo agregar debido a que la variable no acepta valores.',
  VARIABLEERROR = 'No se pudo agregar debido a que la variable no es multivalor o no acepta valores.',

  SYSTEM = 'Sistema',
  STANDARD = 'Estándar',
  OpenGraph = 'Open Graph',
  JSONLD = 'JSON-LD',
  PERSONALIZATION = 'Personalización',
  RECOMENDATION = 'Recomendación',
  EDITORIAL = 'Editorial',

  ERROWEIGHING = 'La ponderación debe de sumar 100',
  TYPECROMA = 'Croma',
  TYPEMATOMO = 'Matomo',
  ERRORPERIOD = 'Debe llenar los campos de día, mes y año',
  ERRORIFRAME = 'No se pudo crear el iframe por falta de datos',
  ERRORRULESTEP = 'La regla ya fue utilizada',

  ERRORINUSE = 'El bloque está en uso',

  PAGEINTERNAL = 'Interna',
  PAGESECTION = 'Sección',
}
