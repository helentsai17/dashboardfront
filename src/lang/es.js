export default {
  route: {
    dashboard: 'Panel de control',
    page401: '401',
    page404: '404',
    setting: 'Ajustes',
    form: 'Formulario',
    createForm: 'Crear',
    onlineCreate: 'vía Enlínea',
    uploadCreate: 'vía Subir',
    editForm: 'Editar',
    onlineEdit: 'vía Enlínea',
    uploadEdit: 'vía Subir',
    patient: 'Paciente',
    listPatient: 'Paciente Lista',
    eligibilityPatient: 'Elegibilidad',
    message: 'Mensaje'
  },
  navbar: {
    logOut: 'Salir',
    dashboard: 'Panel de control',
    setting: 'Ajustes',
    screenfull: 'Pantalla completa',
    theme: 'Tema',
    size: 'Tamaño global'
  },
  login: {
    title: 'Formulario de acceso',
    logIn: 'Acceso',
    username: 'Usuario',
    password: 'Contraseña',
    thirdparty: 'Conectar con',
    thirdpartyTips: 'No se puede simular en local, así que combine su propia simulación de negocios. ! !'
  },
  components: {
    documentation: 'Documentación',
    tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'Orden por defecto',
    dragTips2: 'The after dragging order',
    title: 'Título',
    importance: 'Importancia',
    type: 'Tipo',
    remark: 'Remark',
    search: 'Buscar',
    addElectronic: 'Agregar consentimiento domiciliario',
    addPaper: 'Agregar consentimiento en papel',
    refresh: 'Actualizar',
    batch: 'Carga por lotes',
    batch_download: 'Descargar hoja de lote',
    export: 'Exportar',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Fecha',
    author: 'Autor',
    readings: 'Lector',
    status: 'Estado',
    actions: 'Acciones',
    edit: 'Editar',
    publish: 'Publicar',
    draft: 'Draft',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    mrn: 'MRN',
    name: 'Nombre',
    first_name: 'Nombre de pila',
    last_name: 'Apellido',
    email: 'Correo electrónico',
    created: 'Creado en',
    updated: 'Actualizado en',
    upload_pdf: 'Subir PDF',
    emailInvite: 'Invitación por correo electrónico',
    downloadConsent: 'Descargar consentimiento',
    checkAnswer: 'Verificar respuestas',
    EPIC: 'EPIC',
    ERAP: 'ERAP',
    dob: 'Fecha de nacimiento',
    gender: 'Género',
    print: 'Impresión',
    sendTo: 'Enviar a',
    discard: 'Descarte',
    send: 'Enviar mensaje'
  },
  patient: {
    check: 'Mira a este paciente',
    add: 'Añadir este paciente',
    key: 'Llave',
    value: 'Valor'
  },
  message: {
    publish: 'Publicar',
    draft: 'Draft'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Documento de introducción'
  },
  excel: {
    export: 'Exportar',
    selectedExport: 'Exportar seleccionados',
    placeholder: 'Por favor escribe un nombre de fichero'
  },
  zip: {
    export: 'Exportar',
    placeholder: 'Por favor escribe un nombre de fichero'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading pdf.'
  },
  theme: {
    change: 'Cambiar tema',
    documentation: 'Documentación del tema',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Actualizar',
    close: 'Cerrar',
    closeOthers: 'Cerrar otros',
    closeAll: 'Cerrar todos'
  },
  form: {
    submit: 'Enviar',
    reset: 'Reiniciar',
    education: 'Educación',
    consent: 'Consentimiento',
    full: 'Largo',
    hasLong: 'Este es un texto breve',
    requiredField: 'Este campo no puede estar vacío',
    noCorrectAnswer: 'Seleccione al menos una respuesta correcta',
    add: 'Añadir',
    new: 'Nuevo',
    project: 'Proyecto',
    section: 'Capítulo',
    tip: 'Puntos de conocimiento',
    quiz: 'Examen',
    option: 'Opción',
    protocol: 'Capítulo',
    title: 'Título',
    content: 'Contenido',
    body: 'Contenido',
    pleaseEnter: 'Por favor escribe',
    correct: 'Correcto',
    required: 'Necesario',
    mediaUpload: 'Carga de medios',
    dragToUpload: 'Suelta el archivo aquí o',
    clickToUpload: 'haga clic para subir'
  }
}
