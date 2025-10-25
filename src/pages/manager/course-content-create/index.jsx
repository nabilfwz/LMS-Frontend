import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutateContentSchema } from "../../../utils/zodSchema.js";
import { useMutation } from "@tanstack/react-query";
import {
  createContent,
  updateContent,
} from "../../../services/courseService.js";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

export default function ManageContentCreatePage() {
  const content = useLoaderData();
  const { id, contentId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(mutateContentSchema),
    defaultValues: {
      title: content?.title || "",
      type: content?.type || "",
      youtubeId: content?.youtubeId || "",
      text: content?.text || "",
    },
  });

  const mutateCreate = useMutation({
    mutationFn: (data) => createContent(data),
  });

  const mutateUpdate = useMutation({
    mutationFn: (data) => updateContent(data, contentId),
  });

  const type = watch("type");

  const onSubmit = async (values) => {
    try {
      if (!content) {
        await mutateCreate.mutateAsync({
          ...values,
          courseId: id,
        });
      } else {
        await mutateUpdate.mutateAsync({
          ...values,
          courseId: id,
        });
      }
      navigate(`/manager/courses/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        id="Breadcrumb"
        className="flex items-center gap-5 *:after:content-['/'] *:after:ml-5"
      >
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Manage Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          {content ? "Edit" : "Add"} Content
        </span>
      </div>

      <header className="flex items-center justify-between gap-[30px]">
        <div className="flex items-center gap-[30px]">
          <div className="flex shrink-0 w-[150px] h-[100px] rounded-[20px] overflow-hidden bg-[#D9D9D9]">
            <img
              src="/assets/images/thumbnails/th-1.png"
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-[28px] leading-[42px]">
              {content ? "Edit" : "Add"} Content
            </h1>
            <p className="text-[#838C9D] mt-[1px]">
              Give the best content for the course
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[930px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        {/* TITLE */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Content Title
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/note-favorite-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("title")}
              type="text"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:text-[#838C9D] bg-transparent"
              placeholder="Write a better name for your content"
            />
          </div>
          {errors?.title && (
            <span className="text-[#FF435A]">{errors.title.message}</span>
          )}
        </div>

        {/* TYPE SELECT */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="type" className="font-semibold">
            Select Type
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/crown-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("type")}
              id="type"
              className="appearance-none outline-none w-full py-3 px-2 font-semibold bg-transparent"
            >
              <option value="" hidden>
                Choose content type
              </option>
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
          {errors?.type && (
            <span className="text-[#FF435A]">{errors.type.message}</span>
          )}
        </div>

        {/* YOUTUBE FIELD */}
        {type === "video" && (
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="video" className="font-semibold">
              Youtube Video ID
            </label>
            <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 focus-within:ring-2 focus-within:ring-[#662FFF]">
              <img
                src="/assets/images/icons/bill-black.svg"
                className="w-6 h-6"
                alt="icon"
              />
              <input
                type="text"
                {...register("youtubeId")}
                id="video"
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:text-[#838C9D] bg-transparent"
                placeholder="Enter YouTube video ID"
              />
            </div>
            {errors?.youtubeId && (
              <span className="text-[#FF435A]">{errors.youtubeId.message}</span>
            )}
          </div>
        )}

        {/* CKEDITOR FIELD */}
        {type === "text" && (
          <div className="flex flex-col gap-[10px]">
            <label className="font-semibold">Content Text</label>
            <CKEditor
              editor={ClassicEditor}
              data={content?.text || ""}
              onChange={(_, editor) => {
                const data = editor.getData();
                setValue("text", data);
              }}
            />
            {errors?.text && (
              <span className="text-[#FF435A]">{errors.text.message}</span>
            )}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={content ? mutateUpdate.isLoading : mutateCreate.isLoading}
            className="w-full rounded-full p-[14px_20px] font-semibold text-white bg-[#662FFF]"
          >
            {content ? "Edit" : "Add"} Content Now
          </button>
        </div>
      </form>
    </>
  );
}
