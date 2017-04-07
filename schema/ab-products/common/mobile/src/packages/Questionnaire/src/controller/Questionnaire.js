/**
 * Controller for the Questionnaire view. Loads and saves the Questionnaire data.
 *
 * @since 21.3
 * @author Jeff Martin
 */
Ext.define('Questionnaire.controller.Questionnaire', {
    extend: 'Ext.app.Controller',

    requires: 'Questionnaire.FormFactory',

    isInitializingView: false,

    config: {
        refs: {
            // The navigation view for the view containing the Questionnaire. Override in the app if the
            // navigation view xtype is different then mainView
            navigationView: 'mainview',
            questionnairePanel: 'questionnaire'
        },
        control: {
            navigationView: {
                questionnairebeforepop: 'onBeforePop'
            },
            questionnairePanel: {
                questionnairesave: 'saveQuestionnaire',
                questionnaireidchange: 'onQuestionnaireIdChanged',
                fieldchanged: 'onQuestionnaireFieldChanged'
            }
        }
    },

    /**
     * Handles the beforepop event generated by the navigation controller when a questionnaire
     * form is present in an edit view. When stopBackNavigation is true the user is prompted with
     * an option to proceed or cancel the back action and complete the required fields in the
     * questionnaire.
     * @param continueBackNavigation
     */
    onBeforePop: function (continueBackNavigation) {
        var me = this,
            formView = me.getNavigationView().getNavigationBar().getCurrentView(),
            questionnaire;

        if (formView instanceof Common.view.navigation.Carousel) {
            formView = formView.getDisplayedView();
        }

        questionnaire = formView.down('questionnaire');

        // Force the user to complete the questionnaire items before returning from the form.
        if (continueBackNavigation) {
            me.saveQuestionnaire(questionnaire);
        }
    },

    saveQuestionnaire: function (questionnaire) {
        var me = this,
            xmlString;

        if (questionnaire.validateRequiredFields()) {
            xmlString = me.saveDataAsXml();
            me.writeAnswers(xmlString);
        }
    },

    convertToValidXMLValueCustom: function (fieldValue) {
        if (Ext.isEmpty(fieldValue)) {
            return '';
        }

        if (Ext.isNumber(fieldValue)) {
            return fieldValue;
        }

        fieldValue = fieldValue.replace(/&amp;/g, '&');
        fieldValue = fieldValue.replace(/&/g, '%26');
        fieldValue = fieldValue.replace(/&lt;/g, '<');
        fieldValue = fieldValue.replace(/</g, "%3C");
        fieldValue = fieldValue.replace(/&gt;/g, '>');
        fieldValue = fieldValue.replace(/>/g, "%3E");
        fieldValue = fieldValue.replace(/&apos;/g, '\'');
        fieldValue = fieldValue.replace(/\'/g, "%27");
        fieldValue = fieldValue.replace(/&quot;/g, '\"');
        fieldValue = fieldValue.replace(/\"/g, "%22");
        return fieldValue;
    },

    convertFromXMLValueCustom: function (fieldValue) {
        fieldValue = fieldValue.replace(/%26/g, '&');
        fieldValue = fieldValue.replace(/%3C/g, '<');
        fieldValue = fieldValue.replace(/%3E/g, '>');
        fieldValue = fieldValue.replace(/%27/g, '\'');
        fieldValue = fieldValue.replace(/%22/g, '\"');
        return fieldValue;
    },

    parseXml: function (xmlString) {
        var objDOMParser = new DOMParser();

        return objDOMParser.parseFromString(xmlString, "text/xml");
    },

    selectNodes: function (xmlDocument, xpath) {
        var result = [],
            tempResult,
            tempNode,
            i = 0;

        if (xmlDocument === null) {
            return null;
        }

        tempResult = xmlDocument.evaluate(xpath, xmlDocument, null, XPathResult.ANY_TYPE, null);

        while (tempNode = tempResult.iterateNext()) {
            result[i++] = tempNode;
        }

        return result;
    },

    writeAnswers: function (xmlAnswers) {
        var me = this,
            formView = me.getNavigationView().getNavigationBar().getCurrentView(),
            questionnaire,
            record,
            fieldName;

        if (formView instanceof Common.view.navigation.Carousel) {
            formView = formView.getDisplayedView();
        }

        questionnaire = formView.down('questionnaire');
        record = questionnaire.getRecord();
        fieldName = questionnaire.getFieldName();

        if (record && fieldName) {
            record.set(fieldName, xmlAnswers);
        }
    },

    saveDataAsXml: function () {
        var me = this,
            formView = me.getNavigationView().getNavigationBar().getCurrentView(),
            questionnaire,
            questionnaireId,
            xml,
            fields;

        if (formView instanceof Common.view.navigation.Carousel) {
            formView = formView.getDisplayedView();
        }

        questionnaire = formView.down('questionnaire');
        questionnaireId = questionnaire.getQuestionnaireId();
        xml = '<questionnaire questionnaire_id="' + me.convertToValidXMLValueCustom(questionnaireId) + '">';
        fields = questionnaire.query('field');

        Ext.each(fields, function (field) {
            var newValue,
                dateValue;
            if (field.xtype === 'datepickerfield') {
                dateValue = field.getValue();
                if (dateValue) {
                    newValue = Ext.DateExtras.format(field.getValue(), 'Y-m-d');
                } else {
                    newValue = null;
                }
            } else {
                newValue = field.getValue();
            }

            xml += '<question quest_name="' + me.convertToValidXMLValueCustom(field.getName()) + '" value="' +
                me.convertToValidXMLValueCustom(newValue) + '"/>';
        }, me);

        xml += '</questionnaire>';

        return xml;

    },

    onQuestionnaireIdChanged: function (questionnaireId, questionnaire) {
        var me = this,
            store = Ext.getStore('questions'),
            disablePaging = store.getDisablePaging();

        // Filter by questionaire
        store.filter('questionnaire_id', questionnaireId);
        store.setDisablePaging(true);
        store.load(function (records) {
            var items;
            store.setDisablePaging(disablePaging);
            items = Questionnaire.FormFactory.getQuestionaireForm(records);
            me.setQuestionnaireItems(items, questionnaire);
            me.populateAnswers(questionnaire);
        }, me);
    },

    setQuestionnaireItems: function (items, questionnaire) {
        var questionnaireItems = questionnaire.down('#questionnaireItems'),
            innerItems;

        if (questionnaireItems) {
            innerItems = questionnaireItems.getInnerItems();

            if (innerItems && innerItems.length > 0) {
                questionnaireItems.removeAll(true, true);
            }
            questionnaireItems.add(items);
        }
        questionnaire.addFieldListeners();
    },

    populateAnswers: function (questionnaire) {
        var me = this,
            record = questionnaire.getRecord(),
            fieldName = questionnaire.getFieldName(),
            savedAnswers;

        if (record && fieldName) {
            savedAnswers = record.get(fieldName);
            if (!Ext.isEmpty(savedAnswers)) {
                // This is stuff to read the xml on start
                me.getAnswersFromXmlString(savedAnswers, questionnaire);
            }
        }
    },

    getAnswersFromXmlString: function (xmlString, questionnaire) {
        var me = this,
            questionFields = questionnaire.query('#questionnaireItems field'),
            xmlDoc = me.parseXml(xmlString),
            nodes = me.selectNodes(xmlDoc, '//question');

        me.isInitializingView = true;
        // TODO: Check for nodes == 0
        Ext.each(questionFields, function (field) {
            var i,
                nodeQuestionName,
                nodeValue;

            for (i = 0; i < nodes.length; i++) {
                nodeQuestionName = me.convertFromXMLValueCustom(nodes[i].getAttribute('quest_name'));
                if (field.getName() === nodeQuestionName) {
                    nodeValue = me.convertFromXMLValueCustom(nodes[i].getAttribute('value'));
                    if (field.xtype === 'datepickerfield') {
                        nodeValue = Ext.DateExtras.parse(nodeValue, 'Y-m-d');
                    }
                    field.setValue(nodeValue);
                    break;
                }
            }
        }, me);
        me.isInitializingView = false;
    },

    /**
     * Saves the questionnaires fields when the autoSave property is true
     * @param field
     * @param newValue
     * @param oldValue
     */
    onQuestionnaireFieldChanged: function (field, newValue, oldValue) {
        var me = this,
            formView = me.getNavigationView().getNavigationBar().getCurrentView(),
            questionnaire,
            autoSave;

        if (formView instanceof Common.view.navigation.Carousel) {
            formView = formView.getDisplayedView();
        }

        questionnaire = formView.down('questionnaire');
        autoSave = questionnaire.getAutoSave();

        Log.log('Questionnaire field changed: ' + field.getName() + ' oldValue:' + oldValue + ' newValue: ' + newValue, 'verbose', me, arguments);

        // Do not save the questionnaire fields when the form values are loading.
        if (me.isInitializingView) {
            return;
        }

        if (autoSave) {
            me.saveQuestionnaire(questionnaire);
        }
    }
});