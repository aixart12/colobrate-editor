import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { scrapeAndSave } from "@/service/scrape";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

// Validation schema
const schema = yup.object().shape({
  url: yup.string().url("Invalid Url").required("Url is required"),
});

const WorksapceForm = () => {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    try {
      const { url } = data;
      const scrapeData = await scrapeAndSave({ url: url });
      console.log("scrapeData", scrapeData);

      toast.success("Url Scarped Sucessfully");
      route.push(`/edit/${scrapeData.data.title}/${scrapeData.data.id}`);
    } catch (error: any) {
      toast.error(error.message || " Erro to  scrap url");
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Link to Scrape
              </label>
              <input
                {...register("url")}
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter url"
              />
              {errors.url && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.url.message}
                </p>
              )}
            </div>
            <div className="!mt-12">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Scrape Url
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorksapceForm;
