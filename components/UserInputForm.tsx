import React, { useState } from 'react';
import type { UserData } from '../types';

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
}

const InputField: React.FC<{
  // FIX: Constrain `id` to string keys of UserData to satisfy HTML attribute type requirements.
  id: Extract<keyof UserData, string>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  as?: 'textarea';
}> = ({ id, label, value, onChange, type = 'text', placeholder, as }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: 'w-full bg-stone-800/50 border border-stone-700 rounded-md px-3 py-2 text-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all',
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-400 mb-1">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={3}></textarea>
      ) : (
        <input {...commonProps} type={type} />
      )}
    </div>
  );
};

const SelectField: React.FC<{
  // FIX: Constrain `id` to string keys of UserData to satisfy HTML attribute type requirements.
  id: Extract<keyof UserData, string>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-stone-400 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-stone-800/50 border border-stone-700 rounded-md px-3 py-2 text-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-stone-800">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const motherRelationOptions = [
    { value: 'good', label: 'Buena' },
    { value: 'bad', label: 'Mala' },
    { value: 'complicated', label: 'Complicada' },
    { value: 'deceased', label: 'Fallecida' },
    { value: 'unknown', label: 'No conocida' },
    { value: 'absent', label: 'Ausente' },
    { value: 'distanced', label: 'Distanciada' },
    { value: 'avoiding', label: 'Evitándola' },
    { value: 'imprisoned', label: 'Reclusa de libertad' },
];

const fatherRelationOptions = [
    { value: 'good', label: 'Buena' },
    { value: 'bad', label: 'Mala' },
    { value: 'complicated', label: 'Complicada' },
    { value: 'deceased', label: 'Fallecido' },
    { value: 'unknown', label: 'No conocido' },
    { value: 'absent', label: 'Ausente' },
    { value: 'distanced', label: 'Distanciado' },
    { value: 'avoiding', label: 'Evitándolo' },
    { value: 'imprisoned', label: 'Recluso de libertad' },
];


const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    dob: '',
    parentsStatus: 'together',
    motherRelation: 'good',
    fatherRelation: 'good',
    upbringing: '',
    children: '',
    siblingPosition: '',
    profession: '',
    hobbies: '',
  });
  const [error, setError] = useState<string | null>(null);
  
  const fieldNames: { [key in keyof UserData]: string } = {
    fullName: "Nombre Completo",
    dob: "Fecha de Nacimiento",
    parentsStatus: "Estado de los Padres",
    motherRelation: "Relación con la Madre",
    fatherRelation: "Relación con el Padre",
    upbringing: "Crianza",
    children: "Hijos",
    siblingPosition: "Posición entre hermanos",
    profession: "Profesión",
    hobbies: "Pasatiempos",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof UserData)[] = ['fullName', 'dob', 'upbringing', 'children', 'siblingPosition', 'profession', 'hobbies'];
    for (const field of requiredFields) {
        if (!formData[field].trim()) {
            setError(`Por favor, rellena todos los campos. El campo '${fieldNames[field]}' está vacío.`);
            return;
        }
    }
    setError(null);
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-stone-900/50 border border-stone-800 rounded-2xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="fullName" label="Nombre Completo" value={formData.fullName} onChange={handleChange} placeholder="ej., Ana García" />
            <InputField id="dob" label="Fecha de Nacimiento" type="date" value={formData.dob} onChange={handleChange} />
        </div>

        <div className="border-t border-stone-700 pt-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Antecedentes Familiares</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField 
                    id="parentsStatus" 
                    label="Estado de los Padres" 
                    value={formData.parentsStatus} 
                    onChange={handleChange}
                    options={[
                        { value: 'together', label: 'Juntos' },
                        { value: 'separated', label: 'Separados' },
                        { value: 'other', label: 'Otro' },
                    ]}
                />
                <SelectField 
                    id="motherRelation" 
                    label="Relación con la Madre" 
                    value={formData.motherRelation} 
                    onChange={handleChange}
                    options={motherRelationOptions}
                />
                 <SelectField 
                    id="fatherRelation" 
                    label="Relación con el Padre" 
                    value={formData.fatherRelation} 
                    onChange={handleChange}
                    options={fatherRelationOptions}
                />
            </div>
            <div className="mt-6">
                 <InputField id="upbringing" label="Describe la situación de tu crianza" as="textarea" value={formData.upbringing} onChange={handleChange} placeholder="ej., Me criaron ambos padres, mi padre estuvo ausente, etc." />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputField id="children" label="¿Tienes hijos?" value={formData.children} onChange={handleChange} placeholder="ej., No, o Sí, 2 hijos" />
                <InputField id="siblingPosition" label="¿Cuál es tu posición entre hermanos?" value={formData.siblingPosition} onChange={handleChange} placeholder="ej., Hijo único, el mayor de 3" />
            </div>
        </div>

        <div className="border-t border-stone-700 pt-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4">Vida Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="profession" label="Profesión / Trabajo" value={formData.profession} onChange={handleChange} placeholder="ej., Ingeniera de Software, Maestra" />
                <InputField id="hobbies" label="Pasatiempos" value={formData.hobbies} onChange={handleChange} placeholder="ej., Senderismo, pintar, leer" />
            </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="pt-4 text-center">
            <button
            type="submit"
            className="w-full md:w-auto px-12 py-3 bg-gradient-to-r from-purple-600 to-amber-500 hover:opacity-90 text-white font-bold rounded-lg shadow-lg transition-opacity"
            >
            Generar Mi Mapa Astral
            </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;
