sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode",
    "sap/ui/core/Fragment",
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Element'
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, BindingMode, Fragment, Message, coreLibrary ,Element) {
        "use strict";
        var MessageType = coreLibrary.MessageType;
        return Controller.extend("message.HTML5Module.controller.View1", {
            onInit: function () {
                debugger;
                var oModel, oView;

                oView = this.getView();

                // set message model
                this._MessageManager = sap.ui.getCore().getMessageManager();
                oView.setModel(this._MessageManager.getMessageModel(), "message");

                // or just do it for the whole view
               // this._MessageManager.registerObject(oView, true);

                // default model 
                var oModel = new JSONModel({
                    MandatoryInputValue: "",
                    DateValue: null,
                    IntegerValue: undefined,
                    email: ""
                });
                oModel.setDefaultBindingMode(BindingMode.TwoWay);

                //  var oModel = new JSONModel();
                oView.setModel(oModel);
                // oView.getModel().setProperty("/message",{
                //     MandatoryInputValue: "",
                //     DateValue: null,
                //     IntegerValue: undefined,
                //     Dummy: ""
                // });
            },
            onValidationError: function (oEvent) {
                debugger;
            },
            onValidationSucess: function (oEvent) {
                debugger;
                let sTarget = oEvent.getSource().getBindingPath("value");
                this._removeMessageFromTarget(sTarget);

                 this._MessageManager.addMessages(
                    new Message({
                        message: "String field sucessftully validatated",
                        type: MessageType.Success,
                        target: "/dummy",
                       processor: this.getView().getModel()
                    })
                );
            },
            onMessagePopoverPress: function (oEvent) {
                debugger;
                const oButton = oEvent.getSource(),
                    that = this;
                if (!this._popOver) {
                    Fragment.load({
                        id: this.createId("message_popover"),
                        name: "message.HTML5Module.fragment.messagePopover",
                        controller: this
                    }).then(function (popOver) {
                        that._popOver = popOver;
                        that.getView().addDependent(popOver);
                        popOver.openBy(oButton);
                    });
                } else {
                    this._popOver.openBy(oButton);
                }

            },
            _handleRequiredField: function (oInput) {

                let sTarget = oInput.getBindingPath("value");

                this._removeMessageFromTarget(sTarget);
                this._MessageManager.addMessages(
                    new Message({
                        message: "A mandatory field is required",
                        type: MessageType.Error,
                        target: sTarget,
                        processor: this.getView().getModel()
                    })
                );
            },
            _removeMessageFromTarget: function (sTarget) {
                this._MessageManager.getMessageModel().getData().forEach(function (oMessage) {
                    if (oMessage.target === sTarget) {
                        this._MessageManager.removeMessages(oMessage);
                    }
                }.bind(this));
            },
            onPressSaveButton: function (oEvent) {
                debugger;
                var isNoError;
                var oForm = this.byId("SimpleFormColum");
                var items = oForm.getContent().filter((oContent) => {
                    if (!oContent.getRequired) {
                        return false;
                    } else {

                        return oContent.getRequired();
                    }
                });

                items.forEach((oInput) => {
                    if (!oInput.getValue()) {
                        this._handleRequiredField(oInput);
                    }else{
                        isNoError = true;
                    }
                });

                if(isNoError){
                     this._removeMessageFromTarget("/sucessmessage");
                this._MessageManager.addMessages(
                    new Message({
                        message: "Form sucessftully validatated",
                        type: MessageType.Success,
                        target: "/sucessmessage"
                       
                    })
                );
                }
               
            },
            onChangeRequired: function (oEvent) {
                debugger;
                
            },
            onPressActiveTitle:function(oEvent){
                debugger;
                var oItem = oEvent.getParameter("item"),
						oPage = this.getView().byId("page"),
						oMessage = oItem.getBindingContext("message").getObject(),
						oControl = Element.registry.get(oMessage.getControlId());

					if (oControl) {
						oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
						setTimeout(function(){
							oControl.focus();
						}, 300);
					}
            }
        });
    });