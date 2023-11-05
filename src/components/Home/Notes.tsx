import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../common/CustomModal";
import { BsPlusCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin2Line } from "react-icons/ri";
import TextEditor from "../common/TextEditor";
import { ClipLoader } from "react-spinners";

function Notes() {
  const [selected, setSelected] = useState({
    id: -1,
    title: "",
    richText: "",
    date: "",
  });
  const [notes, setNotes] = useState<
    { id: number; title: string; richText: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenu, setMenu] = useState({ index: -1, isOpen: false });
  const db = useRef<IDBDatabase | null>(null);

  useEffect(() => {
    setLoading(true);
    const request = indexedDB.open("notesDB", 1);

    request.onsuccess = (event) => {
      const database = (event.target as unknown as { result: IDBDatabase })
        .result as IDBDatabase;
      db.current = database;
      if (database.objectStoreNames.contains("notes")) {
        readData(database);
      } else {
        setLoading(false);
      }
    };
    request.onupgradeneeded = (event) => {
      const database = (event.target as unknown as { result: IDBDatabase })
        .result as IDBDatabase;
      if (!database.objectStoreNames.contains("notes")) {
        const objectStore = database.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("title", "title", { unique: false });
      }
    };
  }, []);

  const readData = (database: IDBDatabase) => {
    const transaction = database.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const getAllNotes = objectStore.getAll();

    getAllNotes.onsuccess = () => {
      setNotes(getAllNotes?.result || []);
      setLoading(false);
    };
    getAllNotes.onerror = () => {
      console.error("Error reading notes from the object store");
    };
  };

  const addNotes = async () => {
    if (db.current) {
      const transaction = db.current.transaction(["notes"], "readwrite");
      const objectStore = transaction.objectStore("notes");
      const { title, richText } = selected;
      const date = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });
      if (selected.id !== -1) {
        objectStore.delete(selected.id);
      }
      const request = objectStore.add({
        title,
        richText,
        date,
      });
      request.onsuccess = (event) => {
        const id = (event.target as unknown as { result: number }).result;

        setTimeout(() => {
          setSelected({ id: -1, date: "", title: "", richText: "" });
        }, 1000);

        setNotes((prev) =>
          prev.find((item) => item.id === selected.id)
            ? prev.map((obj, i) => {
                if (obj.id === selected.id) {
                  return {
                    ...selected,
                    date,
                    id,
                  };
                }
                return obj;
              })
            : [...prev, { ...selected, date }]
        );
        //update the allnote state here
      };
      request.onerror = () => {
        console.error("Error adding note to the database");
      };
    }
  };

  const handleSubmit = async () => {
    if (selected.richText || selected.title) {
      await addNotes();
      // set modal false
    }
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    if (db.current) {
      const transaction = db.current.transaction(["notes"], "readwrite");
      const objectStore = transaction.objectStore("notes");

      const request = objectStore.delete(id);

      request.onsuccess = () => {
        setNotes((prev) => prev.filter((obj) => obj.id !== id));
      };
    }
  };

  return (
    <>
      <div className="relative h-full border-[1px] border-slate-100 dark:border-darkshade rounded-md p-[20px] flex-1 flex flex-col">
        {!loading ? (
          <>
            {notes.length ? (
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                {[...notes, { id: -1, title: "", richText: "", date: "" }].map(
                  (item, i) => {
                    return item.id !== -1 ? (
                      <div
                        key={i}
                        className="overflow-hidden group relative hover:bg-gray-100 dark:hover:bg-stone-700 duration-500 ease-in relative cursor-pointer p-[15px] h-[200px] dark:bg-[#242424] bg-slate-100 rounded-md before:absolute before:z-[200] before:top-0 before:right-0 before:rounded-bl-sm before:border-b-[20px] before:border-r-[20px] dark:before:border-[#151515_#151515_#191919_#191919] before:border-[white_white_#e9e9e9_#e9e9e9] before:block before:w-0"
                      >
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(true);
                            setSelected(item);
                          }}
                          className="overflow-hidden flex flex-col gap-[10px] justify-between h-full"
                        >
                          <div className="font-bold">
                            {item?.title || `Note ${i + 1}`}
                          </div>
                          <div className="overflow-hidden cursor-pointer">
                            <TextEditor theme="bubble" value={item.richText} />
                          </div>
                          <div className="text-gray-400 text-sm">
                            {item.date}
                          </div>
                        </div>
                        <div className="animate-pulse in z-[100] absolute top-0 bottom-0 flex items-center right-[5px] text-dark dark:text-light duration-200 ease-in group-hover:opacity-100 opacity-0">
                          <button
                            onMouseEnter={() =>
                              setMenu((prev) => ({
                                ...prev,
                                isOpen: true,
                                index: i,
                              }))
                            }
                          >
                            <BsThreeDotsVertical />
                          </button>
                        </div>
                        <div
                          onMouseLeave={() =>
                            setMenu({ isOpen: false, index: -1 })
                          }
                          className={`${
                            isMenu.isOpen && isMenu.index === i
                              ? "translate-x-0"
                              : "translate-x-full"
                          } duration-300 ease-in z-[199] absolute top-0 bottom-0 right-0 flex items-center justify-center px-[10px] dark:bg-darkshade bg-stone-300 bg- rounded-sm`}
                        >
                          <button
                            disabled={!isMenu.isOpen && isMenu.index !== i}
                            className="hover:text-red-600 duration-200 ease-in"
                            onClick={() => handleDelete(item.id)}
                          >
                            <RiDeleteBin2Line />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="min-h-[200px] cursor-pointer border-[1px] dark:border-stone-500 border-dashed rounded-md flex justify-center items-center text-3xl text-slate-200 hover:text-dark hover:dark:text-light dark:text-darkshade duration-300 ease-in"
                        onClick={() => {
                          setIsOpen(true);
                          setSelected({ ...item, id: i });
                        }}
                      >
                        <BsPlusCircleFill />
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div
                className="cursor-pointer h-full flex-1 border-[1px] dark:border-stone-500 border-dashed rounded-md flex justify-center items-center text-6xl text-slate-200 hover:text-dark hover:dark:text-light dark:text-darkshade duration-300 ease-in"
                onClick={() => {
                  setIsOpen(true);
                  setSelected({ id: 0, title: "", richText: "", date: "" });
                }}
              >
                <BsPlusCircleFill />
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center absolute top-0 left-0 right-0 bottom-0">
            <ClipLoader />
          </div>
        )}
      </div>
      <CustomModal
        isOpen={isOpen}
        data={selected}
        onChange={(e) => setSelected((prev) => ({ ...prev, [e.key]: e.value }))}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Notes;
