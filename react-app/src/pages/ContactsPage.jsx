import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Vous n'êtes pas connecté.");
                return;
            }
            const response = await axios.get('http://localhost:3000/contacts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(response.data);
        } catch (err) {
            setError('Impossible de charger les contacts.');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleNewContactChange = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
        };

        console.log('Données lues directement du formulaire :', contactData);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/contacts', contactData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setContacts([...contacts, response.data]);
            setNewContact({ name: '', email: '', phone: '' });

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Une erreur est survenue.';
            setError(`Impossible d'ajouter le contact: ${errorMessage}`);
        }
    };
    const handleDeleteContact = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mettre à jour l'état en filtrant le contact supprimé
            setContacts(contacts.filter(contact => contact._id !== id));
        } catch (err) {
            setError('Impossible de supprimer le contact.');
        }
    };
    const handleEditContact = async (contact) => {
        const newName = prompt("Nouveau nom :", contact.name);
        const newPhone = prompt("Nouveau téléphone :", contact.phone);

        if (newName === null || newPhone === null) { // L'utilisateur a cliqué sur "Annuler"
            return;
        }

        const updatedFields = { name: newName, phone: newPhone };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/contacts/${contact._id}`, updatedFields, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mettre à jour l'état en remplaçant l'ancien contact par le nouveau
            setContacts(contacts.map(c => (c._id === contact._id ? response.data : c)));
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible de modifier le contact.');
        }
    };

    return (
        <div>
            <h2>Mes Contacts</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Ajouter un contact</h3>
            <form onSubmit={handleAddContact}>
                <input type="text" name="name" placeholder="Nom" value={newContact.name} onChange={handleNewContactChange} required />
                <input type="email" name="email" placeholder="Email" value={newContact.email} onChange={handleNewContactChange} required />
                <input type="text" name="phone" placeholder="Téléphone" value={newContact.phone} onChange={handleNewContactChange} required />
                <button type="submit">Ajouter</button>
            </form>

            <h3>Liste des contacts</h3>
            <ul>
                {contacts.length > 0 ? (
                    contacts.map(contact => (
                        <li key={contact._id}>
                            <strong>{contact.name}</strong> - {contact.email} - {contact.phone}
                            {/* --- AJOUT DES BOUTONS --- */}
                            <button onClick={() => handleEditContact(contact)} style={{ marginLeft: '10px' }}>Modifier</button>
                            <button onClick={() => handleDeleteContact(contact._id)}>Supprimer</button>
                        </li>
                    ))
                ) : (
                    <li>Aucun contact à afficher.</li>
                )}
            </ul>
        </div>
    );
};

export default ContactsPage;