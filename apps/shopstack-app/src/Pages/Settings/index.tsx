import React from 'react';
import { useLoaderData } from 'react-router-dom';

interface SettingsFormData {
  rounding_accuracy: number;
  length_offset: number;
}

interface SettingsProps {
  initialFormData: SettingsFormData;
}

const Settings = () => {
  const initialSettings = useLoaderData() as SettingsFormData;

  const [formData, setFormData] =
    React.useState<SettingsFormData>(initialSettings);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 w-full flex flex-row items-center justify-between px-[2.5vw] bg-[#344151] text-white flex-[0_1_auto]">
        <h1>
          <a href="/" className="text-white">
            End Match Machine Tabulator
          </a>
        </h1>
        <div className="flex flex-row">
          <h2 className="mx-[2.5vw] underline">
            <a href="settings" className="text-white">
              Settings
            </a>
          </h2>
          <h2 className="mx-[2.5vw] underline">Power Off</h2>
        </div>
      </div>
      <h1 id="settings-header" className="my-[2.5vh] mx-[5vw]">
        Settings
      </h1>
      <div className="flex pl-[5vw]">
        <form className="grid grid-cols-2 gap-2.5 auto-rows-[2.17em]">
          <h3 className="m-0 h-min self-center">Rounding Accuracy</h3>
          <input
            type="number"
            name="rounding_accuracy"
            step="any"
            value={formData.rounding_accuracy}
            onChange={handleInputChange}
            className="border border-gray-300 px-2 py-1 rounded"
          />
          <h3 className="m-0 h-min self-center">Board Length Offset</h3>
          <input
            type="number"
            name="length_offset"
            step="any"
            value={formData.length_offset}
            onChange={handleInputChange}
            className="border border-gray-300 px-2 py-1 rounded"
          />
          <div>
            <label>
              <input
                type="radio"
                name="fav_language"
                value="Percent"
                className="mr-1"
              />
              Percent
            </label>
            <label>
              <input
                type="radio"
                name="fav_language"
                value="Absolute"
                className="mr-1"
              />
              Absolute
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
