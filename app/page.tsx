"use client";
import { read } from "fs";
import React, { ChangeEvent, useRef, useState } from "react";
import { handleImage } from "./actions";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { File, Loader2, X } from "lucide-react";
import "./globals.css";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);
  const [details, setDetails] = useState("");

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      let base64Image;
      const mimeType = file.type;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        base64Image = reader.result as string;

        try {
          setLoading(true);
          const res = await handleImage({ base64Image, mimeType });

          if (res) {
            if (res === "") {
              setDetails("No information found, pls try again");
            }
            setDetails(String(res));
          }
        } catch (error) {
          console.log(error);
          alert("Error uploading image");
        } finally {
          setLoading(false);
        }
      };
    }
  };

  const onClose = () => {
    setDetails("");
    setImage("");
  };

  return (
    <div>
      <div className="flex flex-col mt-28 lg:flex-row px-10 lg:px-16 justify-between items-start lg:justify-start lg:items-start gap-y-20 lg:gap-y-0">
        <div className="lg:w-1/2 w-full flex justify-center">
          <input
            onChange={handleFile}
            type="file"
            className="hidden"
            ref={fileRef}
            accept="image/*"
          />
          {image ? (
            <div className="relative border p-4 rounded-2xl">
              <h1 className="text-center text-zinc-500 text-2xl mb-5">
                Your Invoice Pic
              </h1>
              <Image
                src={image && image}
                alt=""
                width={100}
                height={100}
                className="w-72 h-72 object-cover rounded-xl lg:w-96 lg:h-96"
              />
              <div onClick={onClose} className="absolute top-0 right-0">
                <X className="w-4 h-4 bg-white text-black cursor-pointer" />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current && fileRef.current.click()}
              className="border border-slate-500 w-72 h-72  rounded-xl cursor-pointer  flex flex-col text-zinc-300 items-center justify-center"
            >
              <File className=" text-zinc-300" />
              <span>Click here to upload a snap</span>
            </div>
          )}
        </div>

        <div className=" w-full lg:w-1/2 overflow-scroll scrollbars lg:h-[500px] ">
          <h1 className="text-3xl border-b lg:text-4xl text-zinc-600 font-mono">
            Your Invoide details-
          </h1>
          <div className="mt-10 lg:mt-0 w-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ node, ...props }) => (
                  <div className=" w-full my-2 rounded-lg">
                    <pre {...props} />
                  </div>
                ),
                h1: ({ node, ...props }) => (
                  <div className=" w-full my-2 rounded-lg">
                    <h1 {...props} />
                  </div>
                ),
              }}
              className={
                "text-lg text-black leading-8 font-mono w-full max-w-prose "
              }
            >
              {details && details}
            </ReactMarkdown>
            {loading && (
              <div className="text-center text-zinc-500 flex justify-center w-full mt-10">
                <h1 className="animate-pulse">Extracting info...</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
