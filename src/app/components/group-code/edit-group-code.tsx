"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import {
  useGetGroupCodeQuery,
  useUpdateGroupCodeMutation,
} from "../../../redux/group-code/group-code-api";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { IGroupCode } from "@/types/group-code-type";

export default function EditGroupCode() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // 1) Fetch single group-code
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetGroupCodeQuery(id || "");

  // 2) Prepare update
  const [updateGroupCode, { isLoading: isUpdating }] =
    useUpdateGroupCodeMutation();

  // 3) Setup form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IGroupCode>({ mode: "onSubmit" });
  const [img, setImg] = useState("");

  // 4) Prefill on data arrival
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setImg(data.data.img || "");
    }
  }, [data, setValue]);

  // 5) Submit handler
  const onSubmit = async (vals: IGroupCode) => {
    try {
      await updateGroupCode({ id: id!, changes: { name: vals.name, img } }).unwrap();
      router.push("/group-code");
    } catch {
      // handle error if you want
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load group-code." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 py-8 rounded-md space-y-6">
      <GlobalImgUpload image={img} setImage={setImg} isSubmitted={isUpdating} />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none"
          placeholder="Enter group code name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
} 