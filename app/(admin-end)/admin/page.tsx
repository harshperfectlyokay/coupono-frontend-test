"use client";
import { useState } from "react";
import Confirmation from "../../components/admin/ConfirmationBox";
import CustomDropdown from "../../components/admin/Dropdown";

const Admin: React.FC = () => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleDelete = async (category: string) => {
    window.alert(`deleted - ${category}`);
  };
  function printHello() {
    window.alert("Hello");
  }
  function printHelloWorld() {
    window.alert("Hello World");
  }
  function printHelloWorldAgain() {
    window.alert("Hello World Again");
  }
  return (
    <div>
        <>
          <div className="mb-2">
            <h2 className="heading-1">Buttons :</h2>
            <section className="flex flex-wrap items-center mb-2 space-y-1">
              <button className="mr-1 btn-red">Button</button>
              <button className="mr-1 btn-green">Button</button>
              <button className="mr-1 btn-yellow">Button</button>
              <button className="mr-1 btn-black" onClick={printHello}>
                Say Hello
              </button>
              <button className="mr-1 btn-white" onClick={printHelloWorld}>
                Say Hello World
              </button>
              <button
                className="mr-1 btn-primary"
                onClick={printHelloWorldAgain}
              >
                Say Hello World Again
              </button>
            </section>
            <button className="btn-full-width">Full Width Button</button>
          </div>
          <br />
          <div className="mb-2">
            <h2 className="heading-1">Dropdowns :</h2>
            <div className="flex items-center mb-2 space-x-2">
              <select className="basic-dropdown">
                <option key="" value="">
                  Select Option
                </option>
                <option key="john" value="doe">
                  John Doe
                </option>
                <option key="jane" value="doe">
                  Jane Doe
                </option>
                <option key="lorem" value="ipsum">
                  Lorem Ipsum
                </option>
              </select>
              <CustomDropdown />
            </div>
          </div>
          <br />
          <div className="mb-2">
            <h2 className="heading-1">Confirmation Box:</h2>
            <button
              className="btn-primary"
              onClick={() => setDeleteModal(!deleteModal)}
            >
              Delete Category
            </button>
            <Confirmation
              isShow={deleteModal}
              setIsShow={setDeleteModal}
              externalMethod={handleDelete}
              argument="abCategory"
              content={{
                title: "Delete Category",
                body: "Do you really want to delete the category?",
              }}
            />
          </div>
          {/* ------------------------------- */}
          <div className="mb-2">
            <h2 className="heading-1">Buttons :</h2>
            <section className="flex flex-wrap items-center mb-2 space-y-1">
              <button className="mr-1 btn-red">Button</button>
              <button className="mr-1 btn-green">Button</button>
              <button className="mr-1 btn-yellow">Button</button>
              <button className="mr-1 btn-black" onClick={printHello}>
                Say Hello
              </button>
              <button className="mr-1 btn-white" onClick={printHelloWorld}>
                Say Hello World
              </button>
              <button
                className="mr-1 btn-primary"
                onClick={printHelloWorldAgain}
              >
                Say Hello World Again
              </button>
            </section>
            <button className="btn-full-width">Full Width Button</button>
          </div>
          <br />
          <div className="mb-2">
            <h2 className="heading-1">Dropdowns :</h2>
            <div className="flex items-center mb-2 space-x-2">
              <select className="basic-dropdown">
                <option key="" value="">
                  Select Option
                </option>
                <option key="john" value="doe">
                  John Doe
                </option>
                <option key="jane" value="doe">
                  Jane Doe
                </option>
                <option key="lorem" value="ipsum">
                  Lorem Ipsum
                </option>
              </select>
              <CustomDropdown />
            </div>
          </div>
          <br />
          <div className="mb-2">
            <h2 className="heading-1">Confirmation Box:</h2>
            <button
              className="btn-primary"
              onClick={() => setDeleteModal(!deleteModal)}
            >
              Delete Category
            </button>
            <Confirmation
              isShow={deleteModal}
              setIsShow={setDeleteModal}
              externalMethod={handleDelete}
              argument="abCategory"
              content={{
                title: "Delete Category",
                body: "Do you really want to delete the category?",
              }}
            />
          </div>
        </>
      
    </div>
  );
};

export default Admin;
