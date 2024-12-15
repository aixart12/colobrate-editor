import { useParams } from "next/navigation";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { accpetInvite } from "@/service/team-invite";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

const AcceptInvite = () => {
  const router = useRouter();
  const { uuid } = router.query;
  console.log("uuis in the accepit invite", uuid);

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
      const { name } = data;
      //    const token = await createUser({ name, email, password });
      await accpetInvite({
        token: uuid as string,
        name: name,
      });
      toast.success("Account Created Sucessfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Name</label>
              <input
                {...register("name")}
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter Name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="!mt-12">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvite;
