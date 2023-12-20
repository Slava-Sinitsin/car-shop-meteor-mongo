import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TransferInfoCollection } from "../imports/api/collections/TransferInfoCollection";
import { EmployeeCollection } from "../imports/api/collections/EmployeeCollection";
import { UsedInfoCollection } from "../imports/api/collections/UsedInfoCollection";
import { CarCollection } from "../imports/api/collections/CarCollection";
import { PartCollection } from "../imports/api/collections/PartCollection";
import { PassportCollection } from "../imports/api/collections/PassportCollection";
import { ClientBuyerCollection } from "../imports/api/collections/ClientBuyerCollection";
import { CertifyingDocumentCollection } from "../imports/api/collections/CertifyingDocumentCollection";
import { ClientSellerCollection } from "../imports/api/collections/ClientSellerCollection";

Meteor.startup(() => {
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'admin',
            password: 'admin',
        });
    }
});

Meteor.methods({
    'user.login'({ username, password }) {
        const user = Meteor.users.findOne({ username });
        return !!(user && Accounts._checkPassword(user, password));
    },
});

const defineCrudMethods = (collection) => {
    Meteor.methods({
        [`${collection._name}.insert`](document) {
            const newDocumentId = collection.insert(document);
            return newDocumentId;
        },
        [`${collection._name}.update`](documentId, updatedDocument) {
            const result = collection.update({ _id: documentId }, updatedDocument);
            return result;
        },
        [`${collection._name}.delete`](documentId) {
            const result = collection.remove(documentId);
            return result;
        },
    });
    Meteor.publish(`${collection._name}`, function () {
        return collection.find();
    });
};

defineCrudMethods(TransferInfoCollection);
defineCrudMethods(EmployeeCollection);
defineCrudMethods(UsedInfoCollection);
defineCrudMethods(CarCollection);
defineCrudMethods(PartCollection);
defineCrudMethods(PassportCollection);
defineCrudMethods(ClientBuyerCollection);
defineCrudMethods(CertifyingDocumentCollection);
defineCrudMethods(ClientSellerCollection);